-- Migration script to update existing database from MD5 to bcrypt
-- WARNING: This will reset all user passwords!

-- Add new password_hash column
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);

-- You'll need to run the Node.js script to hash passwords and update users
-- Or manually update passwords for existing users

-- Remove old columns after migration
-- ALTER TABLE users DROP COLUMN salt;
-- ALTER TABLE users DROP COLUMN md5_hash;

-- Update session_token column to handle JWT tokens
ALTER TABLE user_sessions MODIFY COLUMN session_token TEXT NOT NULL;
