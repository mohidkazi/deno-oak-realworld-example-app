CREATE DATABASE test;

USE test;

CREATE TABLE user(
    id int NOT NULL,
    username VARCHAR (255) ,
    email ,
    bio VARCHAR (255) DEFAULT '',
    image VARCHAR (255) DEFAULT '',
    password,
    UNIQUE (id) PRIMARY KEY (id)
)
    -- FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)

CREATE TABLE tag (
    id int NOT NULL,
    tag VARCHAR (255),
    UNIQUE (id) PRIMARY KEY (id)
)

CREATE TABLE article (
    id int NOT NULL,
    slug,
    title,
    description,
    body,
    created,
    updated,
    tagList[''],
    favoutited boolean,
    favouriteCount,
    author fk,
)

CREATE TABLE comments (
    id int NOT NULL,
    body,
    articles fk,
)