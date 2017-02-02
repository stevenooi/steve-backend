CREATE TABLE `codmgr2`.`brand` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`image_filename` varchar(255) DEFAULT NULL,
	`image_filepath` varchar(255) DEFAULT NULL,
	`is_delete` TINYINT(1) DEFAULT 0,
	PRIMARY KEY (`id`),
	INDEX ix_brand1 (id, name, is_delete)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 