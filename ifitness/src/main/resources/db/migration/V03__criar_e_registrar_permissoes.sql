CREATE TABLE permission (
	id BIGINT(20) PRIMARY KEY,
	description VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE user_permission (
	id_user BIGINT(20) NOT NULL,
	id_permission BIGINT(20) NOT NULL,
	PRIMARY KEY (id_user, id_permission),
	FOREIGN KEY (id_user) REFERENCES user(id),
	FOREIGN KEY (id_permission) REFERENCES permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- admin
INSERT INTO user (id, name, email, password, birth_date, gender, active) 
	values (3, 'Administrador', 'admin@ifsp.edu.br', '$2a$10$X607ZPhQ4EgGNaYKt3n4SONjIv9zc.VMWdEuhCuba7oLAL5IvcL5.', '2000-01-01', 'MASCULINO', 1);

-- user
INSERT INTO permission (id, description) values 
	(1, 'ROLE_REGISTER_USER'),
	(2, 'ROLE_REMOVE_USER'),
	(3, 'ROLE_SEARCH_USER');

-- activity
INSERT INTO permission (id, description) values 
	(4, 'ROLE_REGISTER_ACTIVITY'),
	(5, 'ROLE_REMOVE_ACTIVITY'),
	(6, 'ROLE_SEARCH_ACTIVITY');

-- admin
INSERT INTO user_permission (id_user, id_permission) values 
	(3, 1),
	(3, 2),
	(3, 3),
	(3, 4),
	(3, 5),
	(3, 6);

-- fernando
INSERT INTO user_permission (id_user, id_permission) values 
	(1, 1),
	(1, 3),
	(1, 4),
	(1, 5),
	(1, 6);

-- juliana
INSERT INTO user_permission (id_user, id_permission) values 
	(2, 1),
	(2, 3),
	(2, 4),
	(2, 5),
	(2, 6);

