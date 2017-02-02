CREATE TABLE `codmgr2`.`role` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`is_delete` TINYINT(1) DEFAULT 0,
	CONSTRAINT uc_role_name UNIQUE (name),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 