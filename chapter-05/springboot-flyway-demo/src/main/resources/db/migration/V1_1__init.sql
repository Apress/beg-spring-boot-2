

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  email varchar(100) DEFAULT NULL,
  PRIMARY KEY (id)
);

insert into users(id, name, email) values(1,'John','john@gmail.com');
insert into users(id, name, email) values(2,'Rod','rod@gmail.com');
insert into users(id, name, email) values(3,'Renold','renold@gmail.com');
