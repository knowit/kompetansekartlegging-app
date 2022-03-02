// Get the most recently created item of an array, based on createdAt.
const getNewestItem = (array) => {
    let sortedArray = array.sort((a, b) =>
        Date.parse(a.createdAt) > Date.parse(b.createdAt) ? -1 : 1
    );
    return sortedArray[0];
};

// Combine the answers with their respective questions.
const mapQuestionToAnswer = (questionMap, answer) => {
    const question = questionMap[answer.questionID];

    if (!question) {
        return {
            knowledge: answer.knowledge,
            motivation: answer.motivation,
            error: {
                message: "question not found in current form definition",
                answer,
            },
        };
    }

    if (question.type === "customScaleLabels") {
        return {
            knowledge: answer.knowledge,
            customScaleValue: answer.customScaleValue,
            question: {
                id: question.id,
                topic: question.topic,
                category: question.category,
            },
        };
    }

    return {
        knowledge: answer.knowledge,
        motivation: answer.motivation,
        updatedAt: answer.updatedAt,
        question: {
            id: question.id,
            topic: question.topic,
            category: question.category,
        },
    };
};

// Get user attribute.
const getUserAttribute = (user, attribute) => {
    const attr = user.Attributes.find((attr) => attr.Name === attribute);
    return attr ? attr.Value : null;
};

// Create a hash map from an array.
const mapFromArray = (xs, keyAttribute) =>
    xs.reduce((map, item) => {
        map[item[keyAttribute]] = item;
        return map;
    }, {});

module.exports = {
    getNewestItem,
    mapQuestionToAnswer,
    getUserAttribute,
    mapFromArray,
};
