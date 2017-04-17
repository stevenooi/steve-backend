CREATE TABLE `user` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`userid` varchar(50) NOT NULL,
	`password` varchar(50) NOT NULL,
	`company_id` int(11) NOT NULL,
	`role_id` int(11) NOT NULL,
	`is_delete` TINYINT(1) DEFAULT 0,
	CONSTRAINT fk_user_company_id FOREIGN KEY (company_id) REFERENCES codmgr2.company(id),
	CONSTRAINT fk_user_role_id FOREIGN KEY (role_id) REFERENCES codmgr2.role(id),
	PRIMARY KEY (`id`),
	INDEX ix_user1 (id, userid, company_id, is_delete)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 