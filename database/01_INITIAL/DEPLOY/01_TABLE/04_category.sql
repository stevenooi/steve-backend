CREATE TABLE `codmgr2`.`category` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`parent_id` int(11) DEFAULT NULL,
	`company_id` int(11) NOT NULL ,
    CONSTRAINT fk_category_company_id FOREIGN KEY (company_id) REFERENCES codmgr2.company(id),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 