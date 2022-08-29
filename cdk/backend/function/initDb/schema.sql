-- Tabeller for Kompetansekartlegging
-- Oppretter dersom det ikke eksisterer fra før av
CREATE TABLE IF NOT EXISTS apiKeyPermission(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    APIKeyHashed VARCHAR(255) NOT NULL,
    organizationID VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS organization(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL,
    owner VARCHAR(255),
    orgname VARCHAR(255) NOT NULL,
    identifierAttribute VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS formDefinition(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    label VARCHAR(255),
    createdAt TIMESTAMPTZ NOT NULL,
    updatedAt TIMESTAMPTZ,
    sortKeyConstant VARCHAR(255) NOT NULL,
    organizationID INTEGER NOT NULL references organization(id)
);
CREATE TABLE IF NOT EXISTS userForm(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL,
    updatedAt TIMESTAMPTZ,
    owner VARCHAR(255),
    formDefinitionID INTEGER NOT NULL references formDefinition(id)
);
CREATE TABLE IF NOT EXISTS category(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    text VARCHAR(255) NOT NULL,
    description TEXT,
    index INTEGER,
    formDefinitionID INTEGER NOT NULL references formDefinition(id),
    organizationID INTEGER NOT NULL references organization(id)
);
DO $$ BEGIN CREATE TYPE questionType AS ENUM (
    'knowledgeMotivation',
    'customScaleLabels',
    'text'
);
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS question(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    text VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    index INTEGER,
    formDefinitionID INTEGER NOT NULL references formDefinition(id),
    categoryID INTEGER NOT NULL references category(id),
    type questionType,
    scaleStart VARCHAR(255),
    scaleMiddle VARCHAR(255),
    scaleEnd VARCHAR(255),
    organizationID INTEGER NOT NULL references organization(id)
);
CREATE TABLE IF NOT EXISTS questionAnswer(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    userFormID INTEGER NOT NULL references userForm(id),
    questionID INTEGER NOT NULL references question(id),
    knowledge REAL,
    motivation REAL,
    customScaleValue REAL,
    textValue TEXT
);
CREATE TABLE IF NOT EXISTS "group"(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    groupLeaderUsername VARCHAR(255) NOT NULL references user(id),
    organizationID INTEGER NOT NULL references organization(id)
);
CREATE TABLE IF NOT EXISTS "user"(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    groupID INTEGER NOT NULL references "group"(id),
    organizationID INTEGER NOT NULL references organization(id)
);