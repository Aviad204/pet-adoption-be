CREATE TABLE IF NOT EXISTS savedList (
 savedListID            VARCHAR(300) DEFAULT(UUID()),                 
 ownerID            VARCHAR(300) NOT NULL,
 petID            VARCHAR(300) NOT NULL,
 PRIMARY KEY (savedListID)
);


