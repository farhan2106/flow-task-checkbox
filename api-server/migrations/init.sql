-- TODO: Get the DBNAME from env variable file

-- Check if the database exists
SELECT datname FROM pg_database WHERE datname = 'flow';

-- If the database does not exist, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'flow') THEN
        CREATE DATABASE flow;
    END IF;
END $$;

-- Connect to the database
\c flow;

-- If the table does not exist, create it
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    due_date TIMESTAMP,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);