-- Tabeller for Kompetansekartlegging
-- Oppretter dersom det ikke eksisterer fra før av
CREATE TABLE IF NOT EXISTS organization(
    id UUID PRIMARY KEY NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    organization_name VARCHAR(255) NOT NULL UNIQUE,
    identifier_attribute VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS api_key_permission(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    api_key_hashed VARCHAR(255) NOT NULL,
    organization_id UUID NOT NULL references organization(id)
);
CREATE TABLE IF NOT EXISTS "catalog"(
    id UUID PRIMARY KEY NOT NULL,
    label VARCHAR(255),
    active BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    organization_id UUID NOT NULL references organization(id),
    UNIQUE (active, organization_id)
);
CREATE TABLE IF NOT EXISTS category(
    id UUID PRIMARY KEY NOT NULL,
    text VARCHAR(255) NOT NULL,
    description TEXT,
    index INTEGER,
    catalog_id UUID NOT NULL references "catalog"(id),
    UNIQUE (catalog_id, index)
);
DO $$ BEGIN CREATE TYPE question_type AS ENUM (
    'knowledge_motivation',
    'custom_scale_labels',
    'text',
    'NULL',
    ''
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
    UNIQUE (category_id, index)
);
CREATE TABLE IF NOT EXISTS question_answer(
    id UUID PRIMARY KEY NOT NULL,
    knowledge REAL,
    motivation REAL,
    custom_scale_value REAL,
    text_value TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    question_id UUID NOT NULL references question(id),
    username VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS "group"(
    id UUID PRIMARY KEY NOT NULL,
    organization_id UUID NOT NULL references organization(id)
);
ALTER TABLE "group"
ADD IF NOT EXISTS group_leader_username VARCHAR(255) NOT NULL;
ALTER TABLE organization
ADD IF NOT EXISTS active_catalog_id UUID references "catalog"(id);
CREATE OR REPLACE FUNCTION update_active() RETURNS TRIGGER AS $$ BEGIN IF NEW.active IS TRUE THEN
UPDATE "catalog"
SET active = NULL
WHERE id != NEW.id
    AND organization_id = NEW.organization_id
    AND active IS TRUE;
UPDATE organization
SET active_catalog_id = NEW.id
WHERE id = NEW.organization_id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER catalogBeforeUpdate BEFORE
UPDATE ON "catalog" FOR EACH ROW EXECUTE FUNCTION update_active();