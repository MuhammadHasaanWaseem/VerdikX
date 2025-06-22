-- SQL query to create a user_records table linked to auth.users with specified columns

CREATE TABLE IF NOT EXISTS user_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  favourite_games text[],
  game_uid text,
  user_about:text,
  user_level integer,
  playstyle text,
  username text UNIQUE NOT NULL,
  avatar text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION update_user_records_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_records_updated_at
BEFORE UPDATE ON user_records
FOR EACH ROW
EXECUTE PROCEDURE update_user_records_updated_at_column();

-- table 2 
CREATE TABLE IF NOT EXISTS friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_records(user_id) ON DELETE CASCADE,
  friend_id uuid REFERENCES user_records(user_id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, friend_id)
);

-- table 3
CREATE TABLE IF NOT EXISTS user_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES user_records(user_id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES user_records(user_id) ON DELETE CASCADE,
  message text NOT NULL,
  message_type text DEFAULT 'text', -- (e.g., 'text', 'image', 'audio')
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  is_read boolean DEFAULT false
);

-- table 4
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES user_records(user_id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES user_records(user_id) ON DELETE CASCADE,
  status text DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  requested_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  responded_at timestamp with time zone
);
