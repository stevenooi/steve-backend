CREATE TABLE `codmgr2`.`store` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) DEFAULT NULL,
	`salt_id` varchar(255) DEFAULT NULL,
	`template_id` int(11) DEFAULT NULL,
	`category_id` int(11) DEFAULT NULL,
	`is_delete` TINYINT(1) DEFAULT 0,
	CONSTRAINT fk_store_template_id FOREIGN KEY (template_id) REFERENCES codmgr2.template(id),
	CONSTRAINT fk_store_category_id FOREIGN KEY (category_id) REFERENCES codmgr2.category(id),
	PRIMARY KEY (`id`),
	INDEX ix_store1 (id, name)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 