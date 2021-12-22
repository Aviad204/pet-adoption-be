CREATE TABLE IF NOT EXISTS pets (
 id            VARCHAR(300) DEFAULT(UUID()),                 
 type            VARCHAR(50) NOT NULL,
 name            VARCHAR(50) NOT NULL,
 status            VARCHAR(50) NOT NULL,
 color            VARCHAR(50),
 breed            VARCHAR(50),
 bio            VARCHAR(200),
 height          INT,
 weight          INT,
 dietery            VARCHAR(200),
 hypoallergnic            BOOLEAN,
 image            VARCHAR(500),
 
 PRIMARY KEY (id)
);


