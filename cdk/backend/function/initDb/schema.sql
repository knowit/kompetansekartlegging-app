-- Tabeller for Kompetansekartlegging
-- Oppretter dersom det ikke eksisterer fra før av


CREATE TABLE IF NOT EXISTS organization(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    owner VARCHAR(255),
    orgname VARCHAR(255) NOT NULL,
    identifierAttribute VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS apiKeyPermission(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    APIKeyHashed VARCHAR(255) NOT NULL,
    organizationID VARCHAR(255) NOT NULL references organization(id)
);

CREATE TABLE IF NOT EXISTS formDefinition(
    id UUID PRIMARY KEY NOT NULL,
    label VARCHAR(255),
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    organizationID VARCHAR(255) NOT NULL references organization(id)
);

CREATE TABLE IF NOT EXISTS userForm(
    id UUID PRIMARY KEY NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    owner VARCHAR(255),
    formDefinitionID UUID NOT NULL references formDefinition(id)
);

CREATE TABLE IF NOT EXISTS category(
    id UUID PRIMARY KEY NOT NULL,
    text VARCHAR(255) NOT NULL,
    description TEXT,
    index INTEGER,
    formDefinitionID UUID NOT NULL references formDefinition(id),
    organizationID VARCHAR(255) NOT NULL references organization(id)
);

DO $$ BEGIN
  CREATE TYPE questionType AS ENUM (
    'knowledgeMotivation', 
    'customScaleLabels', 
    'text'
  );
EXCEPTION
   WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS question(
    id UUID PRIMARY KEY NOT NULL,
    text TEXT,
    topic VARCHAR(255) NOT NULL,
    index INTEGER,
    formDefinitionID UUID NOT NULL references formDefinition(id),
    categoryID UUID NOT NULL references category(id),
    type questionType,
    scaleStart VARCHAR(255),
    scaleMiddle VARCHAR(255),
    scaleEnd VARCHAR(255),
    organizationID VARCHAR(255) NOT NULL references organization(id)
);

CREATE TABLE IF NOT EXISTS questionAnswer(
    id UUID PRIMARY KEY NOT NULL,
    userFormID UUID NOT NULL references userForm(id),
    questionID UUID NOT NULL references question(id),
    knowledge REAL,
    motivation REAL,
    customScaleValue REAL,
    textValue TEXT
);

CREATE TABLE IF NOT EXISTS "group"(
    id UUID PRIMARY KEY NOT NULL,
    organizationID VARCHAR(255) NOT NULL references organization(id),
    groupLeaderUsername VARCHAR(255) NOT NULL 
);

CREATE TABLE IF NOT EXISTS "user"(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    groupID UUID NOT NULL references "group"(id),
    organizationID VARCHAR(255) NOT NULL references organization(id)
);