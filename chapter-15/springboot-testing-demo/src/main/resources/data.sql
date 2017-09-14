
delete from users;

insert into users(id, email, password, name) values
(1, 'admin@gmail.com','admin','Admin'),
(2, 'siva@gmail.com','siva','Siva'),
(3, 'test@gmail.com','test','Test')
;

delete from todos;

insert into todos(id, text, done) values
(1, 'Learn SpringBoot', true),
(2, 'Learn SpringCloud', false)
;