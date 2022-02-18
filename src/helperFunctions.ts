import { API, Auth, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { UserFormList, UserFormWithAnswers } from "./types";
import * as customQueries from "./graphql/custom-queries";
import { GetOrganizationQuery } from './API';
import { getOrganization } from "./graphql/queries";

/*
    Used to call graphql queries and mutations.
    - Query input can be any query or mutation from queries.ts, mutations.ts or custom-queries.ts in the query folder.
    - Variables input is used to pass inputs to the query if its needed.
    
    Use a type to describe what structure you want the result to be. The return type is a Promise, so use (await).data
        to extract the data within.
*/
export const callGraphQL = async <T>(
    query: any,
    variables?: {} | undefined
): Promise<GraphQLResult<T>> => {
    return (await API.graphql(
        graphqlOperation(query, variables)
    )) as GraphQLResult<T>;
};

/*
    Gets all userforms in the database. Returned as an array.
    Because graphql has a limit on how many items that can be querried at a time,
        the "nextToken" is used to redo the query again with a start offset on the index.
*/
export const listUserForms = async () => {
    let nextToken: string | null = null;
    let combinedUserForm: UserFormWithAnswers[] = [];
    do {
        let userForms: UserFormList | undefined = (
            await callGraphQL<UserFormList>(
                customQueries.listUserFormsWithAnswers,
                { nextToken: nextToken }
            )
        ).data;
        if (userForms && userForms.listUserForms.items.length > 0) {
            combinedUserForm = combinedUserForm.concat(
                userForms.listUserForms.items
            );
        }
        if (userForms) nextToken = userForms.listUserForms.nextToken;
    } while (nextToken);

    return combinedUserForm;
};

/*
    Splits the incoming array into arrays of length 25.
    Used to prepear arrays for batch querries. A batch querry can do max 25 items at a time.
*/
const splitArray = <T>(array: T[]): T[][] => {
    if (array.length < 25) return [array];

    let splitArray = [];
    let currentCount = 0;
    while (currentCount < array.length) {
        let availableNumber = Math.min(array.length - currentCount, 25);
        splitArray.push(
            array.slice(currentCount, currentCount + availableNumber)
        );
        currentCount += 25;
    }
    return splitArray;
};

/*
    Do a batch call with a querry and input variables.
    Basicly splits the incoming array of inputs, and dose a batch call for every size 25 array
*/
export const callBatchGraphQL = async <T>(
    query: any,
    variables: { input: any[], organizationID: String },
    table: string
): Promise<GraphQLResult<T>[]> => {
    if (variables.input.length === 0) {
        console.error("Array size must be more than 0 in a batch mutation");
        return [];
    }

    let split = splitArray(variables.input);
    let returnValue = [];
    for (const element of split) {
        returnValue.push(
            (await API.graphql(
                graphqlOperation(query, { input: element, organizationID: variables.organizationID })
            )) as GraphQLResult<T>
        );
    }
    return returnValue;
};

/*
    Rounds a number to a number of decimals.
    - ValueToRound: The number u need to round.
    - DecimalCount: The number of decimals u want in the result.
*/
export const roundDecimals = (
    valueToRound: number,
    decimalCount: number
): number => {
    return (
        Math.round(valueToRound * Math.pow(10, decimalCount)) /
        Math.pow(10, decimalCount)
    );
};

/**
 * Splits a long string into an array of shorter strings, with hyphens where "appropriate".
 *
 * @param {string}  str          Input string.
 * @param {number}  maxLength    Maximum length of result strings.
 */

export const wrapString = (str: string, maxLength: number): string[] => {
    let splitOnSpace = str.split(" ");
    let resultArray: string[] = [];
    for (let i = 0; i < splitOnSpace.length; i++) {
        let s = splitOnSpace[i];
        if (s.length > maxLength) {
            let head = s.slice(0, s.length / 2);
            let tail = s.slice(s.length / 2);
            resultArray.push(head + "-");
            resultArray.push(tail);
        } else {
            if (splitOnSpace.length > i + 1) {
                if (s.length + splitOnSpace[i + 1].length <= maxLength - 1) {
                    resultArray.push(s + " " + splitOnSpace[i + 1]);
                    i++;
                } else {
                    resultArray.push(s);
                }
            } else {
                resultArray.push(s);
            }
        }
    }
    return resultArray;
};

export const Millisecs = {
    FIVEMINUTES: 300000,
    ONEDAY: 86400000,
    THREEDAYS: 259200000,
    THREEMONTHS: 7889400000,
};

export const getOrganizationNameByID = (organizationID : string) => new Promise<string>(async (resolve, reject) => {
    try{

        const res = await callGraphQL<GetOrganizationQuery>(getOrganization, {
            id: organizationID
        });

        const organizationName = res.data?.getOrganization?.orgname;

        if (typeof organizationName === 'string'){
            resolve(organizationName);
        }else{
            reject('no org found');
        }

    } catch(e) {
        reject('no org found');
    }
});