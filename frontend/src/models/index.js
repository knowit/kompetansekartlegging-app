// @ts-check
import { initSchema } from "@aws-amplify/datastore";
import { schema } from "./schema";

const {
    QuestionAnswer,
    Question,
    QuestionFormDefinitionConnection,
    FormDefinition,
    UserForm,
} = initSchema(schema);

export {
    QuestionAnswer,
    Question,
    QuestionFormDefinitionConnection,
    FormDefinition,
    UserForm,
};
