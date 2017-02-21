ALTER TABLE `codmgr2`.`slide` ADD COLUMN `template_id` int(11) NOT NULL;
ALTER TABLE `codmgr2`.`slide` DROP FOREIGN KEY `fk_slide_company_id`; 
ALTER TABLE `codmgr2`.`slide` DROP COLUMN `company_id`;  
