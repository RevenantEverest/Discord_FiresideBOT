DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS songs;
-- DROP TABLE IF EXISTS economy;
DROP TABLE IF EXISTS default_commands;
DROP TABLE IF EXISTS custom_commands;

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE user_settings (
  user_id INT,
  prefix VARCHAR(10)
);

CREATE TABLE playlists (
  playlist_id SERIAL PRIMARY KEY,
  user_id INT,
  name VARCHAR(255)
);

CREATE TABLE songs (
  song_id SERIAL PRIMARY KEY,
  playlist_id INT,
  title VARCHAR(255),
  link VARCHAR(255)
);

CREATE TABLE default_commands (
  command_id SERIAL PRIMARY KEY,
  status VARCHAR(1),
  command VARCHAR(255),
  description VARCHAR(255)
);

CREATE TABLE custom_commands (
  command_id SERIAL PRIMARY KEY,
  user_id INT,
  command VARCHAR(255),
  output VARCHAR(255)
);

-- CREATE TABLE *Insert Name Here* (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(255),
--   author_id INT,
--   guild_name VARCHAR(255),
--   guild_id INT
-- );

-- CREATE TABLE economy (
--
-- );