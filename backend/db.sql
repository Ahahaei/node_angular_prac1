CREATE DATABASE users;

CREATE TABLE users (
    _id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL
);