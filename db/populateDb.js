const { Client } = require('pg');

// Create a pool for PostgreSQL connections
const client = new Client({
    connectionString: process.env.DATABASE_URL
});

const createTables = async () => {
    try {
        // Connect to the database
        console.log('Connecting to the database...');
        await client.connect();

        // Create the users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                membership_status BOOLEAN DEFAULT false,
                admin BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // Create the messages table
        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                body TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                author_visible BOOLEAN DEFAULT false,
                username VARCHAR(255) NOT NULL,
                CONSTRAINT fk_username
                  FOREIGN KEY(username)
                  REFERENCES users(username)
                  ON DELETE CASCADE
            );
        `);

        // Create the session table
        await client.query(`
            CREATE TABLE IF NOT EXISTS session (
                sid VARCHAR PRIMARY KEY,
                sess JSON NOT NULL,
                expire TIMESTAMP(6) NOT NULL
            );
        `);

        // Create indexes for the session table
        await client.query(`
            CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON session(expire);
        `);

        console.log('Tables created successfully!');
        client.release();
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await client.end();
    }
};

createTables();
