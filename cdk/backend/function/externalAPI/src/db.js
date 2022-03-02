const aws = require("aws-sdk");
const docClient = new aws.DynamoDB.DocumentClient();
const cognito = new aws.CognitoIdentityServiceProvider();

const {
    getNewestItem,
    mapQuestionToAnswer,
    getUserAttribute,
} = require("./helpers");

const QUESTION_ANSWER_TABLE_NAME =
    process.env.API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_NAME;
const USER_FORM_TABLE_NAME =
    process.env.API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_NAME;
const QUESTION_TABLE_NAME =
    process.env.API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_NAME;
const CATEGORY_TABLE_NAME =
    process.env.API_KOMPETANSEKARTLEGGIN_CATEGORYTABLE_NAME;
const FORM_DEFINITION_TABLE_NAME =
    process.env.API_KOMPETANSEKARTLEGGIN_FORMDEFINITIONTABLE_NAME;
const USER_POOL_ID = process.env.AUTH_KOMPETANSEKARTLEGGIND11D7CCE_USERPOOLID;
const APIKEYPERMISSION_TABLE_NAME = process.env.API_KOMPETANSEKARTLEGGIN_APIKEYPERMISSIONTABLE_NAME;

const organizationFilterParameter = ':oid';
const organizationFilterExpression = 'organizationID = ' + organizationFilterParameter;


const getOrganizationIDFromAPIKeyHashed = async (APIKeyHashed) => {
    let organizationIDItem = await docClient.query({
        TableName: APIKEYPERMISSION_TABLE_NAME,
        IndexName: "byAPIKeyHashed",
        KeyConditionExpression: "APIKeyHashed = :apikh",
        ExpressionAttributeValues: { ":apikh": APIKeyHashed}
    }).promise();
    return organizationIDItem.Items[0]['organizationID'];
};


// Get answers for a user form.
const getAnswersForUserForm = async (userFormID) => {
    let allAnswers = await docClient
        .query({
            TableName: QUESTION_ANSWER_TABLE_NAME,
            IndexName: "byUserForm",
            KeyConditionExpression: "userFormID = :ufID",
            ExpressionAttributeValues: { ":ufID": userFormID },
            ProjectionExpression:
                "questionID, knowledge, motivation, customScaleValue, updatedAt",
        })
        .promise();

    return allAnswers.Items;
};

// Get answers for a user given a form definition id.
const getAnswersForUser = async (user, formDefinitionID, questionMap) => {
    const email = getUserAttribute(user, "email");
    const username = user.Username;

    let allUserForms = await docClient
        .query({
            TableName: USER_FORM_TABLE_NAME,
            IndexName: "byCreatedAt",
            KeyConditionExpression: "#owner = :username",
            FilterExpression: "#formDef = :formDef",
            ExpressionAttributeNames: {
                "#owner": "owner",
                "#formDef": "formDefinitionID",
            },
            ExpressionAttributeValues: {
                ":username": username,
                ":formDef": formDefinitionID,
            },
        })
        .promise();

    // No answers given.
    if (allUserForms.Items.length < 1) {
        return {
            username,
            email,
            answers: [],
        };
    }

    // Get the latest UserForm.
    let lastUserForm = getNewestItem(allUserForms.Items);

    const answers = await getAnswersForUserForm(lastUserForm.id);
    const answersWithQuestions = answers.map((a) =>
        mapQuestionToAnswer(questionMap, a)
    );

    return {
        username,
        email,
        formDefinitionID,
        updatedAt: lastUserForm.updatedAt,
        answers: answersWithQuestions,
    };
};

// Finds all questions for the given form definition.
const getAllQuestionForFormDef = async (lastFormDefID) => {
    return await docClient
        .query({
            TableName: QUESTION_TABLE_NAME,
            IndexName: "byFormDefinition",
            KeyConditionExpression: "#formDef = :formDef",
            ExpressionAttributeValues: {
                ":formDef": lastFormDefID,
            },
            ProjectionExpression:
                "id, #text, #index, #type, scaleStart, scaleMiddle, scaleEnd, topic, categoryID",
            ExpressionAttributeNames: {
                "#formDef": "formDefinitionID",
                "#text": "text",
                "#index": "index",
                "#type": "type",
            },
        })
        .promise();
};

// Finds all questions for the given category.
const getAllQuestionForCategory = async (categoryID) => {
    return await docClient
        .query({
            TableName: QUESTION_TABLE_NAME,
            IndexName: "byCategory",
            KeyConditionExpression: "#category = :category",
            ExpressionAttributeValues: {
                ":category": categoryID,
            },
            ProjectionExpression:
                "id, #text, #index, #type, scaleStart, scaleMiddle, scaleEnd, topic, categoryID",
            ExpressionAttributeNames: {
                "#category": "categoryID",
                "#text": "text",
                "#index": "index",
                "#type": "type",
            },
        })
        .promise();
};

// Finds all categories.
const getAllCategories = async (organization_ID) => {
    return await docClient
        .scan({
            TableName: CATEGORY_TABLE_NAME,
            ProjectionExpression: "id, description, #text",
            ExpressionAttributeNames: {
                "#text": "text",
            },
            FilterExpression: organizationFilterExpression,
            ExpressionAttributeValues: {[organizationFilterParameter]: organization_ID}
        })
        .promise();
};

// Finds all categories for the given form definition.
const getAllCategoriesForFormDef = async (formDefID) => {
    return await docClient
        .query({
            TableName: CATEGORY_TABLE_NAME,
            IndexName: "byFormDefinition",
            KeyConditionExpression: "#formDef = :formDef",
            ExpressionAttributeValues: {
                ":formDef": formDefID,
            },
            ProjectionExpression: "id, description, #text, #index",
            ExpressionAttributeNames: {
                "#formDef": "formDefinitionID",
                "#text": "text",
                "#index": "index",
            },
        })
        .promise();
};

// With the current arcitecture, users have to be filtered after fetching everyone from
// cognito, because custom-attributes are not searchable
const getAllUsers = async (organization_ID) => {
    let allUsers = [];
    let PaginationToken = null;

    do {
        const res = await cognito
            .listUsers({
                UserPoolId: USER_POOL_ID,
                Filter:'cognito:user_status=\"CONFIRMED\"',
                PaginationToken
            })
            .promise().catch((err) => {
                console.log('err:',err);
            });
        allUsers = [...allUsers, ...res.Users];
        PaginationToken = res.PaginationToken;
    } while (PaginationToken);


    filteredUsers = allUsers.filter((user) => {

        const organizationAttribute = user['Attributes'].filter((attribute) => (
            attribute['Name'] === 'custom:OrganizationID'))[0]

        return organizationAttribute['Value'] === organization_ID
    });

    filteredUsersWithoutOrganizationID = filteredUsers.map((user) => {
        return {
            ...user,
            Attributes: (
                user['Attributes'].filter((attribute) => (
                    attribute['Name'] === 'email'
                ))
            )
        }
    });

    return filteredUsersWithoutOrganizationID;
};

// Find all form definitions.
const getAllFormDefs = async (organization_ID) => {

    return await docClient
        .scan({
            TableName: FORM_DEFINITION_TABLE_NAME,
            FilterExpression: organizationFilterExpression,
            ExpressionAttributeValues: {[organizationFilterParameter]: organization_ID}
        })
        .promise();
};

// Get the newest form definition.
const getNewestFormDef = async (organization_ID) => {

    const form_query = {
        TableName: FORM_DEFINITION_TABLE_NAME,
        IndexName: "byOrganizationByCreatedAt",
        KeyConditionExpression: `${organizationFilterExpression}`,
        ExpressionAttributeValues: {
            [organizationFilterParameter]: organization_ID
        },
        Limit: 1,
        ScanIndexForward: false, // desc

    }

    console.log(form_query);

    const formDefs = await docClient
        .query(form_query)
        .promise();
    return formDefs.Items.length === 0 ? null : formDefs.Items[0];
};

module.exports = {
    getNewestFormDef,
    getAllFormDefs,
    getAllUsers,
    getAllCategories,
    getAllQuestionForFormDef,
    getAnswersForUserForm,
    getAnswersForUser,
    getAllCategoriesForFormDef,
    getAllQuestionForCategory,
    getOrganizationIDFromAPIKeyHashed
};
