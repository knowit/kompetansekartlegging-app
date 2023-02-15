-- Tabeller for Kompetansekartlegging
-- Oppretter dersom det ikke eksisterer fra før av
CREATE TABLE IF NOT EXISTS organization(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    identifier_attribute VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS api_key_permission(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    api_key_hashed VARCHAR(255) NOT NULL,
    organization_id VARCHAR(255) NOT NULL references organization(id)
);
CREATE TABLE IF NOT EXISTS "catalog"(
    id UUID PRIMARY KEY NOT NULL,
    label VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ,
    organization_id VARCHAR(255) NOT NULL references organization(id)
);
CREATE TABLE IF NOT EXISTS category(
    id UUID PRIMARY KEY NOT NULL,
    text VARCHAR(255) NOT NULL,
    description TEXT,
    index INTEGER,
    catalog_id UUID NOT NULL references "catalog"(id),
);
DO $$ BEGIN CREATE TYPE question_type AS ENUM (
    'knowledge_motivation',
    'custom_scale_labels',
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
    type question_type,
    scale_start VARCHAR(255),
    scale_middle VARCHAR(255),
    scale_end VARCHAR(255),
    category_id UUID NOT NULL references category(id),
);
CREATE TABLE IF NOT EXISTS question_answer(
    id UUID PRIMARY KEY NOT NULL,
    knowledge REAL,
    motivation REAL,
    custom_scale_value REAL,
    text_value TEXT question_id UUID NOT NULL references question(id),
    user_id UUID NOT NULL references "user"(id)
);
CREATE TABLE IF NOT EXISTS "group"(
    id UUID PRIMARY KEY NOT NULL,
    organization_id VARCHAR(255) NOT NULL references organization(id),
    group_leader_id VARCHAR(255) NOT NULL references "user"(id)
);
CREATE TABLE IF NOT EXISTS "user"(
    id UUID PRIMARY KEY NOT NULL,
    mail VARCHAR(255) NOT NULL UNIQUE,
    group_id UUID references "group"(id),
    organization_id VARCHAR(255) NOT NULL references organization(id)
);