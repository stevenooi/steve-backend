CREATE TABLE `codmgr2`.`slide` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`company_id` int(11) NOT NULL , 
	`image_filepath` varchar(255) DEFAULT NULL, 
	`image_filename` varchar(255) DEFAULT NULL, 
	`is_delete` TINYINT(1) DEFAULT 0,
	CONSTRAINT fk_slide_company_id FOREIGN KEY (company_id) REFERENCES codmgr2.company(id),
	PRIMARY KEY (`id`),
	INDEX ix_slide1 (id, company_id, is_delete)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 