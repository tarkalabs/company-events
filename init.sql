CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  business_unit VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day INTEGER NOT NULL,
  time VARCHAR(50) NOT NULL,
  session VARCHAR(255) NOT NULL,
  details TEXT
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL,
  comments TEXT NOT NULL,
  UNIQUE(event_id, user_id)
);
