
delete from  users;

INSERT INTO users (id, email, password, name) VALUES 
(1, 'admin@gmail.com', 'admin', 'Admin'),
(2, 'david@gmail.com', 'david', 'David'),
(3, 'ron@gmail.com', 'ron', 'Ron')
;

insert into posts(id, title, content, created_on, updated_on) values
(1, 'Introducing SpringBoot', 'SpringBoot is awesome', '2017-05-10', null),
(2, 'Securing Web applications', 'This post will show how to use SpringSecurity', '2017-05-20', null),
(3, 'Introducing Spring Social', 'Developing social web applications using Spring Social', '2017-05-24', null)
;

insert into comments(id, post_id, name, email, content, created_on, updated_on) values
(1, 1, 'John','john@gmail.com', 'This is cool', '2017-05-10', null),
(2, 1, 'Rambo','rambo@gmail.com', 'Thanks for awesome tips', '2017-05-20', null),
(3, 2, 'Paul', 'paul@gmail.com', 'Nice post buddy.', '2017-05-24', null)
;
