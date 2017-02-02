CREATE TABLE `codmgr2`.`company_brand` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`company_id` int(11) NOT NULL ,
	`brand_id` int(11) NOT NULL,
	`is_delete` TINYINT(1) DEFAULT 0,
	PRIMARY KEY (`id`),
    CONSTRAINT fk_company_brand_company_id FOREIGN KEY (company_id) REFERENCES codmgr2.company(id),
    CONSTRAINT fk_company_brand_brand_id  FOREIGN KEY (brand_id)  REFERENCES codmgr2.brand(id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 