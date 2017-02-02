CREATE TABLE `codmgr2`.`template_slide_imagetype` (
	`id` int(11) NOT NULL AUTO_INCREMENT, 
	`template_id` int(11) NOT NULL,
	`imagetype_id` int(11) NOT NULL,
	`slide_id` int(11) DEFAULT NULL,
	`is_delete` TINYINT(1) DEFAULT 0,
	CONSTRAINT fk_template_slide_imagetype_template_id FOREIGN KEY (template_id) REFERENCES codmgr2.template(id),
	CONSTRAINT fk_template_slide_imagetype_imagetype_id FOREIGN KEY (imagetype_id) REFERENCES codmgr2.imagetype(id),
	CONSTRAINT fk_template_slide_imagetype_slide_id FOREIGN KEY (slide_id) REFERENCES codmgr2.slide(id),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
 