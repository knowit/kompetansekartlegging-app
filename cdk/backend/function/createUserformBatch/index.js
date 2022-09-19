/* Amplify Params - DO NOT EDIT
	API_KOMPETANSEKARTLEGGIN_FORMDEFINITIONTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_FORMDEFINITIONTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_GRAPHQLAPIIDOUTPUT
	API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// extract environment variables
const REGION = process.env.REGION;
const TABLEMAP = JSON.parse(process.env.TABLEMAP);

const QUESTIONTABLE_NAME = TABLEMAP["QuestionTable"];
    //process.env.API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_NAME;
const USERFORMTABLE_NAME = TABLEMAP["UserFormTable"];
    // process.env.API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_NAME;
const QUESTIONANSWERTABLE_NAME = TABLEMAP["QuestionAnswerTable"];
    // process.env.API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_NAME;

const aws = require("aws-sdk");
aws.config.update({ region: REGION });
const docClient = new aws.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

let millisecToday;
let millisecLimit;
let ownerId;
let orgId;

const useTimeLimit = true;

const Millisecs = {
    ONEMINUTE: 60000,
    ONEHOUR: 3600000,
    ONEDAY: 86400000,
};
const Action = {
    Create: 0,
    Update: 1,
};
const returnStatus = {
    ok: 200,
    fail: 275364, //No idea what is best here, so abit random :)
};

exports.handler = async (event, context) => {
    millisecToday = Date.now();
    millisecLimit = millisecToday - Millisecs.ONEDAY * 2;

    if (!event.identity) {
        return {
            status: returnStatus.fail,
            error: "Authentication error",
            failedInputs: [],
        };
    }

    ownerId = event.identity.username;
    orgId = event.arguments.organizationID;

    console.log("Owner: ", ownerId);
    console.log("Event: ", JSON.stringify(event));

    try {
        // Get info about last userform, and/or if need to create a new one.
        const userformInfo = await getOrCreateUserform(
            event.arguments.input[0]
        );
        console.log("Last userform info: ", userformInfo);

        let result = {
            failedData: [],
            errors: [],
            data: [],
        };

        if (userformInfo.oldUserformId) {
            // Get questionAnswers from old userform.
            const questionAnswers = await getQuestionAnswersByUserformId(
                userformInfo.oldUserformId
            );
            // Map questionAnswers to see what needs update and creation.
            const mappedQuestionAnswers = await mapQuestionAnswers(
                event.arguments.input,
                questionAnswers,
                userformInfo.newUserformId ? true : false
            );

            if (userformInfo.newUserformId) {
                console.log("New userform created, filling with answers");
                // Insert old questions into new userform.
                const insertArray = mappedQuestionAnswers.createAnswers.concat(
                    mappedQuestionAnswers.updateAnswers
                );
                console.log(
                    "Inserting mapped answers into new userform: ",
                    insertArray
                );
                const insertResult = await insertQuestionAnswers(
                    insertArray,
                    userformInfo.newUserformId
                );
                if (insertResult.errors.length > 0) {
                    console.log(
                        "Some error happend inserting questions into new userform"
                    );
                    result = insertResult;
                }
            } else {
                console.log(
                    "No new useform created, use only the old one to update the anwers"
                );
                await updateUserformUpdatedAt(userformInfo.oldUserformId);
                const insertResult = await insertQuestionAnswers(
                    mappedQuestionAnswers.createAnswers,
                    userformInfo.oldUserformId
                );
                if (insertResult.errors.length > 0) {
                    console.log(
                        "Some error happend inserting questions into old userform"
                    );
                    result = insertResult;
                } else {
                    await updateQuestionAnswers(
                        mappedQuestionAnswers.updateAnswers
                    );
                }
            }
        } else {
            // No old userform, so just fill the new one with whatever answers is sent from client.
            result = await insertQuestionAnswers(
                event.arguments.input,
                userformInfo.newUserformId
            );
        }

        if (result.errors.length > 0) {
            console.log("Result failed data: ", result.failedData);
            return {
                status: returnStatus.fail,
                err: "some error",
                // result.failedData <- better to return error, but need to structure it correctly.
                failedInputs: [],
            };
        }
        return {
            status: returnStatus.ok,
            err: "no error",
            failedInputs: [],
        };
    } catch (err) {
        console.log("Error in try block: ", err);
        return {
            status: returnStatus.fail,
            error: err,
            failedInputs: [],
        };
    }
};

// Sets 'updatedAt' for a userform to current time.
const updateUserformUpdatedAt = async (userformID) => {
    await docClient
        .update({
            TableName: USERFORMTABLE_NAME,
            Key: { id: userformID },
            UpdateExpression: "SET updatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":updatedAt": new Date(millisecToday).toISOString(),
            },
        })
        .promise();
};

//Get the latest userform and return its id. Checks if a new one needs to be created
//Return: { userformId: string, newUserform: boolean }
async function getOrCreateUserform(eventInput) {
    console.log("Get or create userform ", eventInput);
    let returnValue = {
        newUserformId: null,
        oldUserformId: null,
    };

    //Get last userform
    const lastUserform = await getUserformByOwnerWithLimit(eventInput.formDefinitionID);
    if (typeof lastUserform != "undefined" && lastUserform.length > 0) {
        returnValue.oldUserformId = lastUserform[0].id;
        const createdTime = new Date(lastUserform[0].createdAt).getTime();
        //If using time limit, check for time limit if returning userformid or not, else just return it
        if (useTimeLimit) {
            //CreatedTime bigger than limit == created within limit (reuse)
            if (createdTime > millisecLimit) {
                console.log("Userform found within time limit");
                return returnValue;
            }
            console.log(
                "Userform found outside time limit, creating a new one."
            );
        } else {
            console.log("Userform found, not using timelimit at this time.");
            return returnValue;
        }
    }

    //If no userform found, or is too old, create a new userform
    let userformId = await createUserform(eventInput.formDefinitionID);
    returnValue.newUserformId = userformId;
    console.log("New userform created!");
    return returnValue;
}

async function mapQuestionAnswers(newAnswers, oldAnswers, useNewUserform) {
    console.log("Mapping Answers");
    console.log("Using new userform: ", useNewUserform);
    console.log("New Answers: ", newAnswers);
    console.log("Old Answers: ", oldAnswers);

    let mappedAnswers = newAnswers.map((newAns) => {
        if (oldAnswers === null) {
            newAns.action = Action.Create;
            return newAns;
        }

        const old = oldAnswers.find(
            (oldAns) => oldAns.questionID === newAns.questionID
        );
        // console.log("old question: ", old);
        if (old) {
            //If using new userform, all answers need to be create
            if (useNewUserform) {
                newAns.action = Action.Create;
            } else {
                //Makes it possible to bypass the timeLimit variable (gotten from database (in future)), mostly used for testing
                if (useTimeLimit) {
                    newAns.questionAnswerId = old.id;
                    newAns.action = Action.Update;
                    newAns.updatedAt = new Date(millisecToday).toISOString();
                } else {
                    newAns.action = Action.Create;
                }
            }
        } else {
            newAns.action = Action.Create;
        }
        return newAns;
    });
    let returnMap = {
        createAnswers: mappedAnswers.filter(
            (ans) => ans.action === Action.Create
        ),
        updateAnswers: mappedAnswers.filter(
            (ans) => ans.action === Action.Update
        ),
    };
    //If new userform, add all oldAnswers not mapped yet
    if (useNewUserform)
        oldAnswers.forEach((old) => {
            if (
                !returnMap.createAnswers.some(
                    (ans) => ans.questionID === old.questionID
                )
            )
                returnMap.createAnswers.push(old);
        });
    console.log("Question answer map result: ", JSON.stringify(returnMap));
    return returnMap;
}

//Check answers for update needs, and return any answers not already in database
async function updateQuestionAnswers(mappedQuestionAnswers) {
    console.log("Updating Answers", mappedQuestionAnswers);
    if (mappedQuestionAnswers.length === 0) return null;
    const updateResult = await Promise.all(
        mappedQuestionAnswers.map((answer) => updateQuestionAnswer(answer))
    );
    console.log("Update results ", updateResult);
    return updateResult;
}

const updateQuestionAnswer = (quAns) => {
    if (quAns.customScaleValue != null) {
        return docClient
            .update({
                TableName: QUESTIONANSWERTABLE_NAME,
                Key: {
                    id: quAns.questionAnswerId,
                },
                UpdateExpression:
                    "SET customScaleValue = :customScaleValue, updatedAt = :updatedAt",
                ExpressionAttributeValues: {
                    ":customScaleValue": quAns.customScaleValue,
                    ":updatedAt": new Date(millisecToday).toISOString(),
                },
            })
            .promise();
    }

    return docClient
        .update({
            TableName: QUESTIONANSWERTABLE_NAME,
            Key: {
                id: quAns.questionAnswerId,
            },
            UpdateExpression:
                "SET knowledge = :knowledge, motivation = :motivation, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":knowledge": quAns.knowledge,
                ":motivation": quAns.motivation,
                ":updatedAt": new Date(millisecToday).toISOString(),
            },
        })
        .promise();
};

//Structures and creates the setup for a batchWrite
async function insertQuestionAnswers(answerArray, userformId) {
    let result = {
        failedData: [],
        errors: [],
        data: [],
    };
    console.log("Answer array to insert: ", answerArray);
    console.log("Userform to insert into: ", userformId);
    if (answerArray.length === 0) return result;
    const table = QUESTIONANSWERTABLE_NAME;
    const answers = splitArray(answerArray);
    let prepedAnswers = answers.map((aArray) => {
        return {
            RequestItems: {
                [table]: aArray.map((answer) => {
                    return {
                        PutRequest: {
                            Item: {
                                id: uuidv4(),
                                __typename: "QuestionAnswer",
                                createdAt: new Date(
                                    millisecToday
                                ).toISOString(),
                                updatedAt:
                                    answer.updatedAt ||
                                    new Date(millisecToday).toISOString(),
                                knowledge: answer.knowledge,
                                motivation: answer.motivation,
                                customScaleValue: answer.customScaleValue,
                                orgAdmins: answer.orgAdmins,
                                orgGroupLeaders: answer.orgGroupLeaders,
                                owner: ownerId,
                                questionID: answer.questionID,
                                userFormID: userformId,
                            },
                        },
                    };
                }),
            },
        };
    });
    console.log("Prepped answers: ", JSON.stringify(prepedAnswers));
    let promises = prepedAnswers.map((answers, i) => {
        console.log(`Started writing answer ${i}`)
        return docClient
        .batchWrite(answers, (err, data) => {
            if (err) {
                console.log(`BatchWrite error ${i}: `, err);
                result.failedData.push(err);
                result.errors.push(err);
            } else {
                console.log(`BatchWrite data ${i}: `, data);
                result.data.push(data);
            }
        })
        .promise();
    });
    await Promise.all(promises) // Allows us to fire off all writes at the same time?
    return result;
}

//--------------------------------
//--                            --
//--      Helper functions      --
//--                            --
//--------------------------------

//Return the id of the new userform
async function createUserform(formDefinitionId) {
    try {
        const userformId = uuidv4();
        let result = await docClient
            .put({
                TableName: USERFORMTABLE_NAME,
                Item: {
                    id: userformId,
                    formDefinitionID: formDefinitionId,
                    owner: ownerId,
                    createdAt: new Date(millisecToday).toISOString(),
                    updatedAt: new Date(millisecToday).toISOString(),
                    orgAdmins: `${orgId}0admin`,
                    orgGroupLeaders: `${orgId}0groupLeader`,
                    __typename: "UserForm",
                },
            })
            .promise();
        console.log("Create userform result: ", {
            userform: userformId,
            result: result,
        });
        return userformId;
    } catch (err) {
        throw err;
    }
}

//Returns the X newest userforms by ownerId
async function getUserformByOwnerWithLimit(formDefID = undefined, limit = 1) {
    try {
        let result = await docClient
            .query({
                TableName: USERFORMTABLE_NAME,
                IndexName: "byCreatedAt",
                KeyConditionExpression: "#o = :ownerValue",
                FilterExpression: "#formdefid = :formdefValue",
                ExpressionAttributeNames: {
                    "#o": "owner",
                    "#formdefid": "formDefinitionID"
                },
                ExpressionAttributeValues: {
                    ":ownerValue": ownerId,
                    ":formdefValue": formDefID
                },
                ScanIndexForward: false, //Sort direction: true (default) = ASC, false = DESC
                ConsistentRead: false,
                Limit: limit,
            })
            .promise();
        let lastEvaluatedKey = result.LastEvaluatedKey;
        while (lastEvaluatedKey) {
            result = await docClient
            .query({
                TableName: USERFORMTABLE_NAME,
                IndexName: "byCreatedAt",
                KeyConditionExpression: "#o = :ownerValue",
                FilterExpression: "#formdefid = :formdefValue",  // Make sure we fetch the newest UserForm related to current active form definition
                ExpressionAttributeNames: {
                    "#o": "owner",
                    "#formdefid": "formDefinitionID"
                },
                ExpressionAttributeValues: {
                    ":ownerValue": ownerId,
                    ":formdefValue": formDefID
                },
                ExclusiveStartKey: lastEvaluatedKey,
                ScanIndexForward: false, //Sort direction: true (default) = ASC, false = DESC
                ConsistentRead: false,
                Limit: limit,
            })
            .promise();
            if (result.Items.length > 0)
                break;
            lastEvaluatedKey = result.LastEvaluatedKey;
        }
        console.log("Limited userform querry result: ", result);
        return result.Items;
    } catch (err) {
        throw err;
    }
}

//Returns all questions connected to a specific userform
async function getQuestionAnswersByUserformId(userformId) {
    console.log("Getting question answers for ", userformId);
    try {
        let result = await docClient
            .query({
                TableName: QUESTIONANSWERTABLE_NAME,
                IndexName: "byUserForm",
                KeyConditionExpression: "userFormID = :userFormId",
                ExpressionAttributeValues: {
                    ":userFormId": userformId,
                },
                ConsistentRead: false,
            })
            .promise();
        console.log("QuestionAnswer query result: ", result);
        return result.Items;
    } catch (err) {
        throw err;
    }
}

//Input array gets split into arrays of size 25.
//Returns an array of arrays
function splitArray(array) {
    // console.log("Split array: ", array);
    const arrayLength = 25;
    let newArray = [];
    for (var i = 0; i < array.length; i += arrayLength) {
        newArray.push(array.slice(i, i + arrayLength));
    }
    // console.log("Splitted array: ", newArray);
    return newArray;
}

//Probably a good idea to change this to a more secure uuid generator (like the on in node)
//Create a random Id in the uuidv4 format.
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}
