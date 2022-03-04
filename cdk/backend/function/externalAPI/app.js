/* Amplify Params - DO NOT EDIT
	API_KOMPETANSEKARTLEGGIN_CATEGORYTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_CATEGORYTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_FORMDEFINITIONTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_FORMDEFINITIONTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_GRAPHQLAPIIDOUTPUT
	API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_NAME
	API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_ARN
	API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_NAME
	AUTH_KOMPETANSEKARTLEGGIND11D7CCE_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const { getCurrentInvoke } = require("@vendia/serverless-express");

const crypto = require('crypto');

// db helpers
const {
    getNewestFormDef,
    getAllUsers,
    getAllCategories,
    getAllQuestionForFormDef,
    getAnswersForUser,
    getAllFormDefs,
    getAllCategoriesForFormDef,
    getAllQuestionForCategory,
    getOrganizationIDFromAPIKeyHashed
} = require("./db");

const getOrganizationID = async () => {
    const {event, context} = getCurrentInvoke();
    const apiKey = event['requestContext']['identity']['apiKey']
    const hash = crypto.createHash('sha256');
    const apiKey_hashed = hash.update(apiKey).digest('hex');
    const organization_ID = await getOrganizationIDFromAPIKeyHashed(apiKey_hashed);
    return organization_ID
};

// general helpers
const { mapFromArray } = require("./helpers");

// configure express
const app = express();
const router = express.Router();

// configure router
router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// root
router.get("/", (req, res) => {
    res.json({
        message: "alive and well",
    });
});

// returns: newest answers for all users
router.get("/answers", async (req, res) => {
    // Find the newest FormDefinition.


    const organization_ID = await getOrganizationID();

    const newestFormDef = await getNewestFormDef(organization_ID);

    //console.log('newestFormDef:', newestFormDef);
    if (!newestFormDef) {
        res.status(500).json({
            error: "could not get newest form definition",
        });
    }

    // Get all categories.
    const allCategories = await getAllCategories(organization_ID);
    const categoryMap = mapFromArray(allCategories.Items, "id");
    //console.log('categoryMap:',categoryMap);

    // Find all the questions belonging to the current FormDefinition.
    const allQuestions = await getAllQuestionForFormDef(newestFormDef.id);

    //console.log('allQuestions:', allQuestions);

    const allQuestionsWithCategory = allQuestions.Items.map((q) => ({
        ...q,
        category: categoryMap[q.categoryID].text,
    }));
    const questionMap = mapFromArray(allQuestionsWithCategory, "id");

    // Find all users.
    const allUsers = await getAllUsers(organization_ID);
    //console.log('allUsers:',allUsers);

    // Find answers for the current form definition for each user.
    const userAnswers = await Promise.all(
        allUsers.map((user) =>
            getAnswersForUser(user, newestFormDef.id, questionMap)
        )
    );

    // Filter away users with no answers.
    const nonEmptyUserAnswers = userAnswers.filter(
        (ua) => ua.answers.length > 0
    );

    // Create response.
    return res.json(nonEmptyUserAnswers);
});

// returns: all answers for the given username
router.get("/answers/:username", (req, res) => {
    const googleID = req.params.username;
    if (!googleID) {
        return res.status(422).json({
            error: "missing URL parameter: 'username'",
        });
    }

    return res.status(404).json({
        error: "not implemented",
    });
});

// returns: answers for the newest form definition for the given username
router.get("/answers/:username/newest", async (req, res) => {

    const organization_ID = await getOrganizationID();

    const googleID = req.params.username;
    if (!googleID) {
        // 422 = Unprocessable Entity
        return res.status(422).json({
            error: "missing URL parameter: 'username'",
        });
    }

    // Find the newest FormDefinition.
    const newestFormDef = await getNewestFormDef(organization_ID);
    if (!newestFormDef) {
        res.status(500).json({
            error: "could not get newest form definition",
        });
    }

    const allCategories = await getAllCategories(organization_ID);
    const categoryMap = mapFromArray(allCategories.Items, "id");
    const allQuestions = await getAllQuestionForFormDef(newestFormDef.id);
    const allQuestionsWithCategory = allQuestions.Items.map((q) => ({
        ...q,
        category: categoryMap[q.categoryID].text,
    }));
    const questionMap = mapFromArray(allQuestionsWithCategory, "id");

    const user = { Username: googleID, Attributes: [] };
    const answers = await getAnswersForUser(
        user,
        newestFormDef.id,
        questionMap
    );
    //console.log(answers);
    return res.json(answers);
});

// returns: list of all users
router.get("/users", async (req, res) => {

    const organization_ID = await getOrganizationID();

    const allUsers = await getAllUsers(organization_ID);
    return res.json(
        allUsers
            .filter((u) => u.Enabled)
            .map((u) => ({
                username: u.Username,
                attributes: u.Attributes,
            }))
    );
});

// returns: list of all form definitions
router.get("/catalogs", async (req, res) => {

    const organization_ID = await getOrganizationID();

    const allFormDefs = await getAllFormDefs(organization_ID);
    return res.json(
        allFormDefs.Items.map((fd) => ({
            id: fd.id,
            label: fd.label,
        }))
    );
});

// returns: list of all categories for a form definition
router.get("/catalogs/:id/categories", async (req, res) => {
    const formDefID = req.params.id;
    const categories = await getAllCategoriesForFormDef(formDefID);
    return res.json(categories.Items);
});

// returns: list of all questions for a form definition
router.get("/catalogs/:id/questions", async (req, res) => {
    const formDefID = req.params.id;
    const allQuestions = await getAllQuestionForFormDef(formDefID);
    return res.json(
        allQuestions.Items.map((q) =>
            q.type ? q : { ...q, type: "knowledgeMotivation" }
        )
    );
});

// returns: list of all questions for a category
router.get(
    "/catalogs/:id/categories/:categoryID/questions",
    async (req, res) => {
        const catID = req.params.categoryID;
        const allQuestions = await getAllQuestionForCategory(catID);
        return res.json(
            allQuestions.Items.map((q) =>
                q.type ? q : { ...q, type: "knowledgeMotivation" }
            )
        );
    }
);

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use("/", router);

module.exports = app;
