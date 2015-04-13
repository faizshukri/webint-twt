-- MySQL dump 10.13  Distrib 5.6.23, for osx10.10 (x86_64)
--
-- Host: localhost    Database: tweetstream
-- ------------------------------------------------------
-- Server version	5.6.23

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
-- Table structure for table `stopwords`
--

DROP TABLE IF EXISTS `stopwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stopwords` (
  `words` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stopwords`
--

LOCK TABLES `stopwords` WRITE;
/*!40000 ALTER TABLE `stopwords` DISABLE KEYS */;
INSERT INTO `stopwords` VALUES ('a'),('about'),('above'),('after'),('again'),('against'),('all'),('am'),('an'),('and'),('any'),('are'),('as'),('at'),('be'),('because'),('been'),('before'),('being'),('below'),('between'),('both'),('but'),('by'),('could'),('did'),('do'),('does'),('doing'),('down'),('during'),('each'),('few'),('for'),('from'),('further'),('had'),('has'),('have'),('having'),('he'),('hed'),('hell'),('hes'),('her'),('here'),('heres'),('hers'),('herself'),('him'),('himself'),('his'),('how'),('hows'),('i'),('id'),('ill'),('im'),('ive'),('if'),('in'),('into'),('is'),('it'),('its'),('its'),('itself'),('lets'),('me'),('more'),('most'),('my'),('myself'),('no'),('nor'),('not'),('of'),('off'),('on'),('once'),('only'),('or'),('other'),('ought'),('our'),('ours'),('ourselves'),('out'),('over'),('own'),('same'),('she'),('shed'),('shell'),('shes'),('should'),('so'),('some'),('such'),('than'),('that'),('thats'),('the'),('their'),('theirs'),('them'),('themselves'),('then'),('there'),('theres'),('these'),('they'),('theyd'),('theyll'),('theyre'),('theyve'),('this'),('those'),('through'),('to'),('too'),('under'),('until'),('up'),('very'),('was'),('we'),('wed'),('well'),('were'),('weve'),('were'),('what'),('whats'),('when'),('whens'),('where'),('wheres'),('which'),('while'),('who'),('whos'),('whom'),('why'),('whys'),('with'),('wont'),('would'),('you'),('youd'),('youll'),('youre'),('youve'),('your'),('yours'),('yourself'),('yourselves'),('');
/*!40000 ALTER TABLE `stopwords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-04-13 20:51:06
