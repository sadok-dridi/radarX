-- Change the search_document to use the 'english' dictionary instead of 'simple'
-- This enables word stemming (e.g. searching "develop" matches "developer", "developing")

ALTER TABLE sources 
  DROP COLUMN search_document;

ALTER TABLE sources 
  ADD COLUMN search_document tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      coalesce(name, '') || ' ' ||
      coalesce(slug, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(canonical_url, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS sources_search_document_idx ON sources USING GIN (search_document);

ALTER TABLE opportunities 
  DROP COLUMN search_document;

ALTER TABLE opportunities 
  ADD COLUMN search_document tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(content, '') || ' ' ||
      coalesce(author_name, '') || ' ' ||
      coalesce(location_text, '') || ' ' ||
      coalesce(category, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS opportunities_search_document_idx ON opportunities USING GIN (search_document);
