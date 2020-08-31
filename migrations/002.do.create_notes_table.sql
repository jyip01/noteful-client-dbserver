CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  modified TIMESTAMP DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL
);