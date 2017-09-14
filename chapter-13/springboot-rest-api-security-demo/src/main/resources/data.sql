
delete from  user_role;
delete from  roles;
delete from  users;

INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER')
;

INSERT INTO users (id, email, password, name) VALUES 
(1, 'admin@gmail.com', '$2a$10$hKDVYxLefVHV/vtuPhWD3OigtRyOykRLDdUAp80Z1crSoS1lFqaFS', 'Admin'),
(2, 'siva@gmail.com', '$2a$10$UFEPYW7Rx1qZqdHajzOnB.VBR3rvm7OI7uSix4RadfQiNhkZOi2fi', 'Siva'),
(3, 'user@gmail.com', '$2a$10$ByIUiNaRfBKSV6urZoBBxe4UbJ/sS6u1ZaPORHF9AtNWAuVPVz1by', 'DemoUser')
;

insert into user_role(user_id, role_id) values
(1,1),
(1,2),
(3,2)
;

insert into posts(post_id, title, content, created_on, updated_on) values
(1,'Introducing SpringBoot','SpringBoot is an opinionated approach for building Spring applications.', '2017-06-20', null),
(2,'CRUD using Spring Data JPA','Spring Data JPA provides JpaRepository which can be extended to have CRUD operations', '2017-06-25', null),
(3,'Securing Web apps using SpringSecurity','Spring Security provides Authentication and Authorization support.', '2017-04-20', now())
;