CREATE DATABASE  IF NOT EXISTS `termindb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `termindb`;
-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: termindb
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `a_arzt`
--

DROP TABLE IF EXISTS `a_arzt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `a_arzt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titel` varchar(45) DEFAULT NULL,
  `vorname` varchar(450) DEFAULT NULL,
  `nachname` varchar(450) DEFAULT NULL,
  `fachrichtung` varchar(450) DEFAULT NULL,
  `telefon` varchar(45) DEFAULT NULL,
  `email` varchar(450) DEFAULT NULL,
  `strasse` varchar(450) DEFAULT NULL,
  `plz` int(11) DEFAULT NULL,
  `ort` varchar(450) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `a_arzt`
--

LOCK TABLES `a_arzt` WRITE;
/*!40000 ALTER TABLE `a_arzt` DISABLE KEYS */;
INSERT INTO `a_arzt` VALUES (1,'Dr','Wolfgang','Wögerer','Kardiologie','+43 650 3456789','wögerer@gmail.com','Spengergasse',1050,'Wien'),(2,'Dr.','Rudolf','Radelbauer','Urologie','+43 650 5678903','radelbauer@gmail.com','Spengergasse',1050,'Wien'),(3,'Dr.','Simon','Pirker','Otrhopädie','+43 699 12478334','pirker@gmail.com','Pilgrammgasse',1060,'Wien');
/*!40000 ALTER TABLE `a_arzt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patienten`
--

DROP TABLE IF EXISTS `patienten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patienten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titel` varchar(45) DEFAULT NULL,
  `vorname` varchar(255) DEFAULT NULL,
  `nachname` varchar(255) DEFAULT NULL,
  `svnr` bigint(20) DEFAULT NULL,
  `geburtsdatum` date DEFAULT NULL,
  `geschlecht` enum('w','m') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patienten`
--

LOCK TABLES `patienten` WRITE;
/*!40000 ALTER TABLE `patienten` DISABLE KEYS */;
INSERT INTO `patienten` VALUES (1,'Ing','Elias','Brandtner',1237010180,'2000-10-10','m'),(2,'Mag','Vincent','Aigner',1237010180,'2000-10-10','m');
/*!40000 ALTER TABLE `patienten` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `termindb`.`patienten_BEFORE_INSERT`
BEFORE INSERT ON `termindb`.`patienten`
FOR EACH ROW
BEGIN
	declare msg varchar(128);
	call is_valid_svnr(new.svnr, @val);
	IF @val = 0 THEN
        set msg = concat('MyTriggerError: Trying to insert not correct svnr: ', cast(new.svnr as char));
        set new.svnr = null;
        signal sqlstate '45000' set message_text = msg;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `termindb`.`patienten_BEFORE_UPDATE`
BEFORE UPDATE ON `termindb`.`patienten`
FOR EACH ROW
BEGIN
	declare msg varchar(128);
	call is_valid_svnr(new.svnr, @val);
	IF @val = 0 THEN
        set msg = concat('MyTriggerError: Trying to insert not correct svnr: ', cast(new.svnr as char));
        set new.svnr = null;
        signal sqlstate '45000' set message_text = msg;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `t_termin`
--

DROP TABLE IF EXISTS `t_termin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_termin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `beginn` datetime DEFAULT NULL,
  `dauer` int(11) DEFAULT NULL,
  `a_arzt_id` int(11) NOT NULL,
  `patienten_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_t_termin_a_arzt_idx` (`a_arzt_id`),
  KEY `fk_t_termin_patienten1_idx` (`patienten_id`),
  CONSTRAINT `fk_t_termin_a_arzt` FOREIGN KEY (`a_arzt_id`) REFERENCES `a_arzt` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_termin_patienten1` FOREIGN KEY (`patienten_id`) REFERENCES `patienten` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24379 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_termin`
--

LOCK TABLES `t_termin` WRITE;
/*!40000 ALTER TABLE `t_termin` DISABLE KEYS */;
INSERT INTO `t_termin` VALUES (24358,'2021-06-11 12:45:00',15,1,1),(24359,'2021-06-11 13:45:00',15,1,2),(24360,'2021-06-11 15:45:00',60,1,NULL),(24361,'2021-06-12 15:45:00',60,1,NULL),(24362,'2021-06-12 17:45:00',60,1,1),(24363,'2021-06-14 10:00:00',30,1,NULL),(24364,'2021-06-11 10:30:00',14,2,NULL),(24365,'2021-06-12 10:30:00',14,2,2),(24366,'2021-06-22 12:30:00',45,2,NULL),(24369,'2021-06-15 10:30:00',15,3,2),(24372,'2021-06-15 10:30:00',15,3,NULL),(24374,'2021-06-14 17:00:00',60,1,NULL),(24376,'2021-06-14 03:40:00',60,1,2),(24377,'2021-06-11 17:45:00',60,1,NULL),(24378,'2021-06-16 17:45:00',15,1,NULL);
/*!40000 ALTER TABLE `t_termin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'termindb'
--

--
-- Dumping routines for database 'termindb'
--
/*!50003 DROP PROCEDURE IF EXISTS `is_valid_svnr` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `is_valid_svnr`(in svnr bigint, out output int)
BEGIN
	declare returnvalue int;
	declare x INT;
    declare s_svnr VARCHAR(10);

    set returnvalue = 0;
    set s_svnr = cast(svnr as Char(10));
    set x = 1;
    
    start_loop: LOOP
		IF x > 10 THEN
			LEAVE start_loop;
		END IF;
        IF x = 1 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 3;
		END IF;
         IF x = 2 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 7;
		END IF;
         IF x = 3 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 9;
		END IF;
		IF x = 5 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 5;
		END IF;
         IF x = 6 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 8;
		END IF;
         IF x = 7 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 4;
		END IF;
         IF x = 8 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 2;
		END IF;
         IF x = 9 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 1;
		END IF;
         IF x = 10 THEN
			set returnvalue = returnvalue + cast(substring(s_svnr, x, 1) as UNSIGNED) * 6;
		END IF;
		set x = x + 1;
	END LOOP;
    
    set output = 0;
    IF mod(returnvalue, 11) = cast(substring(s_svnr, 4, 1) as UNSIGNED) THEN
		set output = 1;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-11 21:04:33
