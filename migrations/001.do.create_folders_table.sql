CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE folders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);