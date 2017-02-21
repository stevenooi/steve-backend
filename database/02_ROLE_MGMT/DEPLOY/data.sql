INSERT INTO `codmgr2`.`company` (`name`) VALUES ('test_company1');

INSERT INTO `codmgr2`.`category` (`name`,`company_id`) SELECT 'test_group1', MAX(c.id) from `codmgr2`.`company` c;

INSERT INTO `codmgr2`.`template` (`name`) VALUES ('test_template1');
INSERT INTO `codmgr2`.`template` (`name`) VALUES ('test_template2');




