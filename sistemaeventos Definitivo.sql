CREATE DATABASE  IF NOT EXISTS `sistemaeventos` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `sistemaeventos`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sistemaeventos
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `idAdministrador` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `dueno` tinyint(1) DEFAULT 0,
  `tokenCambiarContrasena` varchar(255) DEFAULT NULL,
  `fechaExpiracionTokenCambiarContrasena` datetime DEFAULT NULL,
  PRIMARY KEY (`idAdministrador`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (1,'Admin Principal','admin@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG',1,1,NULL,NULL),(2,'Moderador','mod@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG',1,0,NULL,NULL),(4,'Ana Lopez','ana@test.com','$2a$10$KdSWDlvMhQS6pIM5r5rgouRnZZChf3KphCS1hUTSvAyhSd2B22hVu',1,0,NULL,NULL),(5,'Martin Cardenas','martin.050913gtrrz@gmail.com','$2a$10$bZt030klTRq4WRn1GjHNWujf.qYkOcY9MI5jxPLXAI1JYEpFZGoOG',1,0,NULL,NULL),(6,'Laura Mendez','laura@test.com','$2a$10$zKzaqoV3kOSlf5.rcdX4X.Mfd1q1k1tDs/NtIlZRDuWpCqUhVGk1W',1,0,NULL,NULL);
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boleto`
--

DROP TABLE IF EXISTS `boleto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boleto` (
  `idBoleto` int(11) NOT NULL AUTO_INCREMENT,
  `codigoQR` varchar(100) NOT NULL,
  `estado` enum('Activo','Inactivo','Reserva','Cancelado') DEFAULT 'Reserva',
  `idOrden` int(11) NOT NULL,
  `idZona` int(11) NOT NULL,
  PRIMARY KEY (`idBoleto`),
  UNIQUE KEY `codigoQR` (`codigoQR`),
  KEY `idOrden` (`idOrden`),
  KEY `idZona` (`idZona`),
  CONSTRAINT `boleto_ibfk_1` FOREIGN KEY (`idOrden`) REFERENCES `orden` (`idOrden`) ON UPDATE CASCADE,
  CONSTRAINT `boleto_ibfk_2` FOREIGN KEY (`idZona`) REFERENCES `zonaevento` (`idZona`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boleto`
--

LOCK TABLES `boleto` WRITE;
/*!40000 ALTER TABLE `boleto` DISABLE KEYS */;
INSERT INTO `boleto` VALUES (1,'91c2cd39-33ba-11f1-9f06-0892042554e0','Inactivo',1,1),(2,'91c2d948-33ba-11f1-9f06-0892042554e0','Activo',1,2),(3,'91c2d9ea-33ba-11f1-9f06-0892042554e0','Cancelado',2,1),(4,'91c2da29-33ba-11f1-9f06-0892042554e0','Activo',3,5),(5,'91c2da65-33ba-11f1-9f06-0892042554e0','Activo',4,7),(6,'91c2db26-33ba-11f1-9f06-0892042554e0','Activo',4,7),(7,'91c2db5c-33ba-11f1-9f06-0892042554e0','Cancelado',5,9),(8,'fa931695-34a8-11f1-9f06-0892042554e0','Activo',6,1),(9,'fa931be8-34a8-11f1-9f06-0892042554e0','Activo',6,1),(10,'3e1023d3-3516-11f1-9f06-0892042554e0','Cancelado',7,1),(11,'3e11c119-3516-11f1-9f06-0892042554e0','Cancelado',8,2),(12,'74d829f2-3519-11f1-9f06-0892042554e0','Activo',9,10),(13,'74d82b12-3519-11f1-9f06-0892042554e0','Activo',9,10),(14,'74d82b8f-3519-11f1-9f06-0892042554e0','Activo',9,10),(15,'74d82c04-3519-11f1-9f06-0892042554e0','Activo',9,10),(16,'8af87738-3519-11f1-9f06-0892042554e0','Cancelado',10,10),(17,'8af9a70e-3519-11f1-9f06-0892042554e0','Activo',11,9),(18,'4955daa9-354f-11f1-9f06-0892042554e0','Cancelado',12,9),(19,'5801325e-354f-11f1-9f06-0892042554e0','Cancelado',13,9),(20,'94ec2582-354f-11f1-9f06-0892042554e0','Cancelado',14,9),(21,'b1fc8b7a-3556-11f1-9f06-0892042554e0','Activo',15,1),(22,'37e00a12-355c-11f1-9f06-0892042554e0','Cancelado',16,9),(23,'37e00c3c-355c-11f1-9f06-0892042554e0','Cancelado',16,9),(24,'779c11e3-355c-11f1-9f06-0892042554e0','Cancelado',17,9),(25,'779c1680-355c-11f1-9f06-0892042554e0','Cancelado',17,9),(26,'7dc8eb10-355c-11f1-9f06-0892042554e0','Activo',18,9),(27,'7dc9cf3e-355c-11f1-9f06-0892042554e0','Activo',18,9),(28,'4e21d642-357f-11f1-9f06-0892042554e0','Cancelado',19,12),(29,'4e21db08-357f-11f1-9f06-0892042554e0','Cancelado',19,12),(30,'4e21dbdf-357f-11f1-9f06-0892042554e0','Cancelado',19,12),(31,'52c5c190-357f-11f1-9f06-0892042554e0','Activo',20,12),(32,'52c5c29b-357f-11f1-9f06-0892042554e0','Activo',20,12),(33,'52c5c32a-357f-11f1-9f06-0892042554e0','Activo',20,12),(34,'3e0e444f-3583-11f1-9f06-0892042554e0','Activo',21,11),(43,'e37e6ca5-39da-11f1-849c-d843ae0807eb','Cancelado',24,10),(44,'1ff15f36-39dc-11f1-849c-d843ae0807eb','Cancelado',25,4),(45,'b1a58560-39dc-11f1-849c-d843ae0807eb','Activo',26,4);
/*!40000 ALTER TABLE `boleto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `idEvento` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` enum('festival','teatro','deporte','corporativo','conferencia') NOT NULL,
  `fecha` datetime NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `listado` tinyint(1) DEFAULT 0,
  `cancelado` tinyint(1) DEFAULT 0,
  `rechazado` tinyint(1) DEFAULT 0,
  `suspendido` tinyint(1) DEFAULT 0,
  `motivoSuspension` text DEFAULT NULL,
  `motivoRechazo` text DEFAULT NULL,
  `pagado` tinyint(1) DEFAULT 0,
  `idUsuario` int(11) NOT NULL,
  PRIMARY KEY (`idEvento`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (1,'Concierto Rock','El mejor rock de la región en vivo.','festival','2026-06-10 20:00:00','Auditorio Municipal',1,0,0,0,NULL,NULL,0,1),(2,'Torneo Gaming','Competencia oficial de videojuegos.','corporativo','2026-07-01 15:00:00','Centro de Convenciones',1,0,0,0,NULL,NULL,0,1),(3,'Conferencia Tech','Ponentes expertos en tecnología e innovación.','conferencia','2026-08-20 10:00:00','Hotel Plaza',1,0,0,0,NULL,NULL,0,4),(4,'Festival Jazz','Música jazz en vivo bajo las estrellas.','festival','2026-09-05 19:00:00','Parque Central',1,0,0,0,NULL,NULL,0,1),(5,'Obra de Teatro','Representación clásica con elenco profesional.','teatro','2026-05-15 18:00:00','Teatro Principal',1,0,0,0,NULL,NULL,0,4),(6,'90\'s Pop Tour','Un concierto increíble para probar el backend.','festival','2026-12-15 20:00:00','Auditorio Central',1,0,0,0,NULL,NULL,0,1),(7,'Concierto','Un concierto increíble para probar el backend.','festival','2026-12-15 20:00:00','Auditorio Central',0,0,1,0,NULL,'no cumple con los lineamientos del sitio',0,1),(8,'Proyecto X','Celebracion por el cierre del cuatri','festival','2026-04-20 22:00:00','UTSLRC',0,1,0,0,NULL,NULL,0,10),(9,'Proyecto X','Celebracion por el fin del cuatri','festival','2026-06-20 22:00:00','UTSLRC',0,1,0,0,NULL,NULL,0,2),(10,'Proyecto X','Celebracion','festival','2026-04-30 01:13:00','UTSLRC',0,0,1,0,NULL,NULL,0,2),(11,'Diagrama de Clases Fest','Celebracion para estudiantes de TI y OCI tambien','festival','2026-04-18 14:04:00','UT',1,0,0,0,NULL,NULL,0,10),(12,'Juegos del estudiante','Evento para estudiantes de la Universidad Tecnologica de San Luis Rio Colorado y UES','deporte','2026-04-18 17:06:00','UT',0,0,1,0,NULL,'a',0,10),(26,'Celebracion por teminacion de cuatri','Todos son bienvenidos!','festival','2026-04-17 23:10:00','Av. Jalisco, 83457 San Luis Río Colorado, Son.',1,0,0,0,NULL,NULL,0,11);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenevento`
--

DROP TABLE IF EXISTS `imagenevento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenevento` (
  `idImagen` int(11) NOT NULL AUTO_INCREMENT,
  `urlImagen` varchar(255) NOT NULL,
  `estado` enum('Pendiente','Rechazada','Aprobada') DEFAULT 'Pendiente',
  `fechaSubida` datetime DEFAULT current_timestamp(),
  `fechaAprobacion` datetime DEFAULT NULL,
  `portada` tinyint(1) DEFAULT 0,
  `motivo` varchar(255) DEFAULT NULL,
  `idEvento` int(11) NOT NULL,
  PRIMARY KEY (`idImagen`),
  KEY `idEvento` (`idEvento`),
  CONSTRAINT `imagenevento_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenevento`
--

LOCK TABLES `imagenevento` WRITE;
/*!40000 ALTER TABLE `imagenevento` DISABLE KEYS */;
INSERT INTO `imagenevento` VALUES (9,'https://res.cloudinary.com/dxlretjp7/image/upload/v1775880864/eventos-app/eventos/pvncwklx3mdvk5suduls.png','Rechazada','2026-04-10 21:14:23',NULL,0,'imagen no es clara\n',10),(10,'https://res.cloudinary.com/dxlretjp7/image/upload/v1775881720/eventos-app/eventos/sjkcumy29caz58ihdpr9.png','Rechazada','2026-04-10 21:28:39',NULL,0,'imagen no es clara\n',10),(11,'https://res.cloudinary.com/dxlretjp7/image/upload/v1775881842/eventos-app/eventos/wgfi8uqavrjxdpwg0nc2.png','Rechazada','2026-04-10 21:30:41',NULL,0,'imagen no es clara\n',10),(12,'https://res.cloudinary.com/dxlretjp7/image/upload/v1775892051/eventos-app/eventos/b3aiq2fks47z1uuqduxp.png','Rechazada','2026-04-11 00:20:51',NULL,1,'imagen no es clara\n',10),(13,'https://res.cloudinary.com/dxlretjp7/image/upload/v1775930685/eventos-app/eventos/dmtqkuwt4gjcqvv63olp.png','Aprobada','2026-04-11 11:04:45','2026-04-11 11:05:36',1,NULL,11),(14,'https://res.cloudinary.com/dxlretjp7/image/upload/v1775930847/eventos-app/eventos/raxeqjdrbpby02fhsa1c.png','Rechazada','2026-04-11 11:07:27',NULL,1,'Imagen no sigue las normativas del sitio',12),(22,'11-imagen.jpg','Aprobada','2026-04-16 13:56:03','2026-04-16 13:56:29',1,NULL,26),(23,'teatro.jpg','Aprobada','2026-04-16 13:56:03','2026-04-16 13:56:29',0,NULL,5),(24,'rock.avif','Aprobada','2026-04-16 13:56:03','2026-04-16 13:56:29',1,NULL,1),(25,'videojuegos.jpg','Aprobada','2026-04-16 14:04:05','2026-04-16 14:04:05',1,NULL,2),(26,'tecnologia.webp','Aprobada','2026-04-16 14:06:13','2026-04-16 14:06:13',1,NULL,3),(27,'jazz.webp','Aprobada','2026-04-16 14:07:14','2026-04-16 14:07:14',1,NULL,4),(28,'pop.jpg','Aprobada','2026-04-16 14:09:00','2026-04-16 14:09:00',1,NULL,6),(29,'teatro.jpg','Aprobada','2026-04-16 14:09:45','2026-04-16 14:09:45',1,NULL,5);
/*!40000 ALTER TABLE `imagenevento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modificacioneseventoslistados`
--

DROP TABLE IF EXISTS `modificacioneseventoslistados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modificacioneseventoslistados` (
  `idModificacion` int(11) NOT NULL AUTO_INCREMENT,
  `fechaModificacion` datetime DEFAULT current_timestamp(),
  `modificaciones` varchar(255) DEFAULT NULL,
  `fechaCancelacion` datetime DEFAULT NULL,
  `motivos` varchar(255) DEFAULT NULL,
  `idAdministrador` int(11) NOT NULL,
  `idEvento` int(11) NOT NULL,
  PRIMARY KEY (`idModificacion`),
  KEY `idAdministrador` (`idAdministrador`),
  KEY `idEvento` (`idEvento`),
  CONSTRAINT `modificacioneseventoslistados_ibfk_1` FOREIGN KEY (`idAdministrador`) REFERENCES `administrador` (`idAdministrador`) ON UPDATE CASCADE,
  CONSTRAINT `modificacioneseventoslistados_ibfk_2` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modificacioneseventoslistados`
--

LOCK TABLES `modificacioneseventoslistados` WRITE;
/*!40000 ALTER TABLE `modificacioneseventoslistados` DISABLE KEYS */;
INSERT INTO `modificacioneseventoslistados` VALUES (1,'2026-04-08 19:19:35','Cambio de fecha',NULL,'Clima',1,1),(2,'2026-04-08 19:19:35','Cambio de precio',NULL,'Promoción',2,3);
/*!40000 ALTER TABLE `modificacioneseventoslistados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden`
--

DROP TABLE IF EXISTS `orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden` (
  `idOrden` int(11) NOT NULL AUTO_INCREMENT,
  `fechaOrden` datetime DEFAULT current_timestamp(),
  `fechaExpiracion` datetime DEFAULT NULL,
  `notificacion` tinyint(1) DEFAULT 0,
  `idEvento` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  PRIMARY KEY (`idOrden`),
  KEY `idEvento` (`idEvento`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `orden_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON UPDATE CASCADE,
  CONSTRAINT `orden_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden`
--

LOCK TABLES `orden` WRITE;
/*!40000 ALTER TABLE `orden` DISABLE KEYS */;
INSERT INTO `orden` VALUES (1,'2026-04-08 19:19:35','2026-04-08 19:29:35',0,1,2),(2,'2026-04-08 19:19:35','2026-04-08 19:29:35',0,1,3),(3,'2026-04-08 19:19:35','2026-04-08 19:29:35',0,3,2),(4,'2026-04-08 19:19:35','2026-04-08 19:39:35',0,4,5),(5,'2026-04-08 19:19:35','2026-04-08 19:49:35',0,5,6),(6,'2026-04-09 23:46:08','2026-04-09 23:56:08',0,1,1),(7,'2026-04-10 12:48:15','2026-04-10 12:58:15',0,1,7),(8,'2026-04-10 12:48:15','2026-04-10 12:58:15',0,1,7),(9,'2026-04-10 13:11:15','2026-04-10 13:21:15',0,5,7),(10,'2026-04-10 13:11:52','2026-04-10 13:21:52',0,5,7),(11,'2026-04-10 13:11:52','2026-04-10 13:21:52',0,5,7),(12,'2026-04-10 19:36:35','2026-04-10 19:46:35',0,5,7),(13,'2026-04-10 19:37:00','2026-04-10 19:47:00',0,5,7),(14,'2026-04-10 19:38:42','2026-04-10 19:48:42',0,5,7),(15,'2026-04-10 20:29:34','2026-04-10 20:39:34',0,1,10),(16,'2026-04-10 21:09:06','2026-04-10 21:19:06',0,5,2),(17,'2026-04-10 21:10:53','2026-04-10 21:20:53',0,5,2),(18,'2026-04-10 21:11:03','2026-04-10 21:21:03',0,5,2),(19,'2026-04-11 01:20:15','2026-04-11 01:30:15',0,6,2),(20,'2026-04-11 01:20:23','2026-04-11 01:30:23',0,6,2),(21,'2026-04-11 01:48:26','2026-04-11 01:58:26',0,6,2),(24,'2026-04-16 14:26:10','2026-04-16 14:36:10',0,5,11),(25,'2026-04-16 14:35:01','2026-04-16 14:45:01',0,2,11),(26,'2026-04-16 14:39:06','2026-04-16 14:49:06',0,2,11);
/*!40000 ALTER TABLE `orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `idPago` int(11) NOT NULL AUTO_INCREMENT,
  `fechaPago` datetime DEFAULT current_timestamp(),
  `cantidadPagada` decimal(10,2) NOT NULL,
  `idOrden` int(11) NOT NULL,
  PRIMARY KEY (`idPago`),
  KEY `idOrden` (`idOrden`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idOrden`) REFERENCES `orden` (`idOrden`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,'2026-04-08 19:19:35',500.00,1),(2,'2026-04-08 19:19:35',300.00,3),(3,'2026-04-08 19:19:35',400.00,4),(4,'2026-04-09 23:47:52',500.00,6),(5,'2026-04-10 13:11:30',528.00,9),(6,'2026-04-10 13:12:00',330.00,11),(7,'2026-04-10 20:29:48',275.00,15),(8,'2026-04-10 21:11:16',396.00,18),(9,'2026-04-11 01:20:45',2640.00,20),(10,'2026-04-11 01:48:36',330.00,21),(13,'2026-04-16 14:35:22',55.00,25),(14,'2026-04-16 14:39:12',55.00,26);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudevento`
--

DROP TABLE IF EXISTS `solicitudevento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudevento` (
  `idSolicitud` int(11) NOT NULL AUTO_INCREMENT,
  `idEvento` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idAdministrador` int(11) DEFAULT NULL,
  `tipo` enum('Cancelacion','Modificacion') NOT NULL,
  `causa` varchar(255) DEFAULT NULL,
  `estado` enum('Pendiente','Cancelada','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `fechaSolicitud` datetime DEFAULT current_timestamp(),
  `fechaResolucion` datetime DEFAULT NULL,
  PRIMARY KEY (`idSolicitud`),
  KEY `idEvento` (`idEvento`),
  KEY `idUsuario` (`idUsuario`),
  KEY `idAdministrador` (`idAdministrador`),
  CONSTRAINT `solicitudevento_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON UPDATE CASCADE,
  CONSTRAINT `solicitudevento_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON UPDATE CASCADE,
  CONSTRAINT `solicitudevento_ibfk_3` FOREIGN KEY (`idAdministrador`) REFERENCES `administrador` (`idAdministrador`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudevento`
--

LOCK TABLES `solicitudevento` WRITE;
/*!40000 ALTER TABLE `solicitudevento` DISABLE KEYS */;
INSERT INTO `solicitudevento` VALUES (1,1,1,NULL,'Modificacion','Cambiar horario','Pendiente','2026-04-08 19:19:36',NULL),(2,3,4,NULL,'Cancelacion','Problemas personales','Pendiente','2026-04-08 19:19:36',NULL),(3,4,1,NULL,'Modificacion','Cambio de ubicación','Pendiente','2026-04-08 19:19:36',NULL);
/*!40000 ALTER TABLE `solicitudevento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `ine` varchar(255) DEFAULT NULL,
  `selfie` varchar(255) DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `cuentaBancaria` varchar(100) DEFAULT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `eventosMaximos` int(11) DEFAULT 5,
  `datosVerificados` tinyint(1) DEFAULT 0,
  `estadoVerificacion` enum('Pendiente','Aprobada','Rechazada','Nuevo') DEFAULT 'Nuevo',
  `activo` tinyint(1) DEFAULT 1,
  `correoVerificado` tinyint(1) DEFAULT 0,
  `tokenVerificacionCorreo` varchar(255) DEFAULT NULL,
  `fechaExpiracionTokenVerificacionCorreo` datetime DEFAULT NULL,
  `tokenCambiarContrasena` varchar(255) DEFAULT NULL,
  `fechaExpiracionTokenCambiarContrasena` datetime DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Carlos Vallejo','carlos@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG',NULL,NULL,NULL,NULL,NULL,5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL),(2,'Ana Lopez','ana@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG','eventos-app/documentos/2/r8rhccnpqso7geqgaqhp','eventos-app/documentos/2/judodcugbgv5zrzs3uyd','QWERTYUIUYTR145267','123456789098765432','abc',5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL),(3,'Luis Ramirez','luis@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG',NULL,NULL,NULL,NULL,NULL,5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL),(4,'Maria Torres','maria@test.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkcW',NULL,NULL,NULL,NULL,NULL,5,0,'Nuevo',1,1,NULL,NULL,NULL,NULL),(5,'Pedro Sanchez','pedro@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG','eventos-app/documentos/5/nhenbaygcu1s49iel4qy','eventos-app/documentos/5/uzafcrsup3b3ekkk0kzl','PQOWIURGFCBXS123NM','123456789098765432','NU',5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL),(6,'Laura Gomez','laura@test.com','$2a$10$NfHhRxGw6dREAmgdrP2n1O82OksrhL94YiNFU3OQQhttL.zfNUwpG',NULL,NULL,NULL,NULL,NULL,5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL),(7,'Martin Gutierrez','martin.050913gtrrzOLDDD@gmail.com','$2a$10$oVgk.xzBoVkm9u4GQLHR9Ov/YGY19q.Q868EdV2JO4J8HV/k2UOeq',NULL,NULL,NULL,NULL,NULL,5,0,'Nuevo',1,0,'1b5f401a-3555-11f1-9f06-0892042554e0-8147','2026-04-10 21:18:11',NULL,NULL),(8,'Test User','test999@test.com','hash123',NULL,NULL,NULL,NULL,NULL,5,0,'Nuevo',1,0,NULL,NULL,NULL,NULL),(9,'Martin Gutierrez','alfgtrz76@gmail.com','$2a$10$gc1YRnHYWzwoeBqYFwLaZecmQDTBMMWPLtyxneUuC6FzCrgeA1M7W','eventos-app/documentos/9/j4puo6nozvgjpt9lyqup','eventos-app/documentos/9/eq3ed67epsmzctwpxime','GUCM050913HSLTRRA1','123456789098765432','NU',5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL),(10,'Martin Cardenas','martin.050913gtrrz@gmail.com','$2a$10$INKQl/KmuqNVIRP1RNlCXeYp9FF9a3oAV5pPq/F6sWjidr5DRgNXu','http://localhost:3000/uploads/10-ine.jpg','http://localhost:3000/uploads/10-selfie.jpg','GUCM050913HSLTRRA1','123456789012345678','NU',5,0,'Rechazada',1,1,NULL,NULL,NULL,NULL),(11,'Carlos Vallejo','carloxdsz@gmail.com','$2a$10$VZtpECxhu243BR483x4zJ.XzvOrPHNhfl0Jg2FJ5D.c2uBp1d11Aq','eventos-app/documentos/11/xlw5oqyse6olnzvb43ow','eventos-app/documentos/11/atyuqdfjlybiqqay86kq','123123123213213213','123123123213213231','123123213131312321312312313123123213',5,1,'Aprobada',1,1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zonaevento`
--

DROP TABLE IF EXISTS `zonaevento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zonaevento` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL CHECK (`precio` >= 0),
  `capacidad` int(11) NOT NULL CHECK (`capacidad` > 0),
  `idEvento` int(11) NOT NULL,
  PRIMARY KEY (`idZona`),
  KEY `idEvento` (`idEvento`),
  CONSTRAINT `zonaevento_ibfk_1` FOREIGN KEY (`idEvento`) REFERENCES `evento` (`idEvento`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zonaevento`
--

LOCK TABLES `zonaevento` WRITE;
/*!40000 ALTER TABLE `zonaevento` DISABLE KEYS */;
INSERT INTO `zonaevento` VALUES (1,'General',250.00,80,1),(2,'VIP',500.00,20,1),(3,'Participante',150.00,40,2),(4,'Espectador',50.00,10,2),(5,'Estandar',300.00,150,3),(6,'Premium',600.00,50,3),(7,'General',200.00,100,4),(8,'Preferente',350.00,20,4),(9,'Platea',180.00,60,5),(10,'Balcon',120.00,20,5),(11,'General',300.00,100,6),(12,'VIP',800.00,20,6),(13,'General',300.00,100,7),(14,'VIP',800.00,20,7),(15,'General',150.00,100,8),(16,'Barra Libre',150.00,100,8),(17,'General',100.00,150,9),(18,'Barra Libre',150.00,100,9),(19,'General',100.00,150,10),(20,'Barra libre',150.00,100,10),(21,'General',100.00,150,11),(22,'VIP',150.00,100,11),(23,'General',100.00,200,12),(24,'Externos',200.00,100,12),(39,'General',100.00,200,26),(40,'VIP',250.00,30,26);
/*!40000 ALTER TABLE `zonaevento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sistemaeventos'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `ev_cancelar_boletos_expirados` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = '+00:00' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `ev_cancelar_boletos_expirados` ON SCHEDULE EVERY 1 MINUTE STARTS '2026-04-08 19:16:15' ON COMPLETION PRESERVE ENABLE DO BEGIN
    -- Cancela automaticamente los boletos en Reserva cuya orden expiro
    UPDATE Boleto b
    INNER JOIN Orden o ON b.idOrden = o.idOrden
    SET b.estado = 'Cancelado'
    WHERE b.estado = 'Reserva'
      AND o.fechaExpiracion < NOW();
END */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'sistemaeventos'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_aprobarRechazarImagenEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_aprobarRechazarImagenEvento`(IN `p_idImagen` INT, IN `p_accion` VARCHAR(20), IN `p_motivo` VARCHAR(255))
BEGIN
    DECLARE v_imagenExistente INT;

    SELECT COUNT(*) INTO v_imagenExistente FROM ImagenEvento WHERE idImagen = p_idImagen;

    IF v_imagenExistente = 0 THEN
        SELECT 'ERROR_IMAGEN_NO_EXISTE' AS mensaje;
    ELSE
        IF p_accion = 'Aprobada' THEN
            UPDATE ImagenEvento
            SET estado = 'Aprobada', fechaAprobacion = NOW(), motivo = NULL
            WHERE idImagen = p_idImagen;
            SELECT 'OK_IMAGEN_APROBADA' AS mensaje;
        ELSEIF p_accion = 'Rechazada' THEN
            UPDATE ImagenEvento
            SET estado = 'Rechazada', fechaAprobacion = NOW(), motivo = p_motivo
            WHERE idImagen = p_idImagen;
            SELECT 'OK_IMAGEN_RECHAZADA' AS mensaje;
        ELSE
            SELECT 'ERROR_ACCION_INVALIDA' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_buscarEventos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_buscarEventos`(IN `p_idAdministrador` INT, IN `p_idEvento` INT, IN `p_tituloEvento` VARCHAR(100), IN `p_categoria` VARCHAR(30), IN `p_fechaInicio` DATETIME, IN `p_fechaFin` DATETIME, IN `p_idOrganizador` INT, IN `p_nombreOrganizador` VARCHAR(100))
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            e.idEvento,
            e.titulo,
            e.descripcion,
            e.categoria,
            e.fecha,
            e.ubicacion,
            e.listado,
            e.cancelado,
            e.pagado,
            MIN(z.precio) AS precioMinimo,
            MAX(z.precio) AS precioMaximo,
            SUM(z.capacidad) AS capacidadTotal,
            org.idUsuario AS organizadorId,
            org.nombre AS organizadorNombre,
            org.correo AS organizadorCorreo
        FROM Evento e
        INNER JOIN Usuario org ON e.idUsuario = org.idUsuario
        LEFT JOIN ZonaEvento z ON e.idEvento = z.idEvento
        WHERE (p_idEvento IS NULL OR p_idEvento = 0 OR e.idEvento = p_idEvento)
          AND (p_tituloEvento IS NULL OR TRIM(p_tituloEvento) = '' OR e.titulo LIKE CONCAT('%', p_tituloEvento, '%'))
          AND (p_categoria IS NULL OR TRIM(p_categoria) = '' OR e.categoria = p_categoria)
          AND (p_fechaInicio IS NULL OR e.fecha >= p_fechaInicio)
          AND (p_fechaFin IS NULL OR e.fecha <= p_fechaFin)
          AND (p_idOrganizador IS NULL OR p_idOrganizador = 0 OR org.idUsuario = p_idOrganizador)
          AND (p_nombreOrganizador IS NULL OR TRIM(p_nombreOrganizador) = ''
               OR org.nombre LIKE CONCAT('%', p_nombreOrganizador, '%'))
        GROUP BY e.idEvento, e.titulo, e.descripcion, e.categoria, e.fecha, e.ubicacion,
                 e.listado, e.cancelado, e.pagado, org.idUsuario, org.nombre, org.correo
        ORDER BY e.fecha DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_buscarImagenes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_buscarImagenes`(IN `p_idAdministrador` INT, IN `p_idImagen` INT, IN `p_idEvento` INT, IN `p_estado` VARCHAR(20), IN `p_portada` BOOLEAN, IN `p_motivo` VARCHAR(255), IN `p_fechaInicio` DATETIME, IN `p_fechaFin` DATETIME)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            i.idImagen, i.urlImagen, i.estado, i.fechaSubida, i.fechaAprobacion, i.portada, i.motivo,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha, e.ubicacion AS eventoUbicacion,
            u.idUsuario AS organizadorId, u.nombre AS organizadorNombre, u.correo AS organizadorCorreo
        FROM ImagenEvento i
        INNER JOIN Evento e ON i.idEvento = e.idEvento
        INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
        WHERE (p_idImagen IS NULL OR p_idImagen = 0 OR i.idImagen = p_idImagen)
          AND (p_idEvento IS NULL OR p_idEvento = 0 OR e.idEvento = p_idEvento)
          AND (p_estado IS NULL OR TRIM(p_estado) = '' OR i.estado = p_estado)
          AND (p_portada IS NULL OR i.portada = p_portada)
          AND (p_motivo IS NULL OR TRIM(p_motivo) = '' OR i.motivo LIKE CONCAT('%', p_motivo, '%'))
          AND (p_fechaInicio IS NULL OR i.fechaSubida >= p_fechaInicio)
          AND (p_fechaFin IS NULL OR i.fechaSubida <= p_fechaFin)
        ORDER BY i.fechaSubida DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_buscarOrden` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_buscarOrden`(IN `p_idOrden` INT, IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_nombreUsuario` VARCHAR(100), IN `p_fechaInicio` DATETIME, IN `p_fechaFin` DATETIME, IN `p_nombreEvento` VARCHAR(100))
BEGIN
    SELECT
        o.idOrden,
        o.fechaOrden,
        o.fechaExpiracion,
        o.notificacion,
        e.idEvento,
        e.titulo AS eventoTitulo,
        e.categoria AS eventoCategoria,
        e.fecha AS eventoFecha,
        e.ubicacion AS eventoUbicacion,
        u.idUsuario AS idUsuarioComprador,
        u.nombre AS compradorNombre,
        org.idUsuario AS idUsuarioOrganizador,
        org.nombre AS organizadorNombre,
        p.idPago,
        p.fechaPago,
        p.cantidadPagada AS totalPagado,
        b.idBoleto,
        b.codigoQR,
        b.estado AS estadoBoleto,
        z.idZona,
        z.nombre AS nombreZona,
        z.precio AS precioBoleto
    FROM Orden o
    INNER JOIN Evento e ON o.idEvento = e.idEvento
    INNER JOIN Usuario u ON o.idUsuario = u.idUsuario
    INNER JOIN Usuario org ON e.idUsuario = org.idUsuario
    LEFT JOIN Pago p ON o.idOrden = p.idOrden
    INNER JOIN Boleto b ON o.idOrden = b.idOrden
    INNER JOIN ZonaEvento z ON b.idZona = z.idZona
    WHERE (p_idOrden IS NULL OR p_idOrden = 0 OR o.idOrden = p_idOrden)
      AND (p_idUsuario IS NULL OR p_idUsuario = 0 OR o.idUsuario = p_idUsuario)
      AND (p_nombreUsuario IS NULL OR TRIM(p_nombreUsuario) = '' OR u.nombre LIKE CONCAT('%', p_nombreUsuario, '%'))
      AND (p_fechaInicio IS NULL OR o.fechaOrden >= p_fechaInicio)
      AND (p_fechaFin IS NULL OR o.fechaOrden <= p_fechaFin)
      AND (p_idEvento IS NULL OR p_idEvento = 0 OR e.idEvento = p_idEvento)
      AND (p_nombreEvento IS NULL OR TRIM(p_nombreEvento) = '' OR e.titulo LIKE CONCAT('%', p_nombreEvento, '%'))
    ORDER BY o.fechaOrden DESC, b.idBoleto ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_buscarSolicitudes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_buscarSolicitudes`(IN `p_idAdministrador` INT, IN `p_idSolicitud` INT, IN `p_idEvento` INT, IN `p_idUsuario` INT, IN `p_idAdminAtendio` INT, IN `p_tipo` VARCHAR(20), IN `p_estado` VARCHAR(20), IN `p_fechaInicio` DATETIME, IN `p_fechaFin` DATETIME)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            s.idSolicitud, s.tipo, s.causa, s.estado, s.fechaSolicitud, s.fechaResolucion,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha, e.ubicacion AS eventoUbicacion,
            u.idUsuario AS solicitanteId, u.nombre AS solicitanteNombre, u.correo AS solicitanteCorreo,
            a.idAdministrador AS adminAtendioId, a.nombre AS adminAtendioNombre
        FROM solicitudEvento s
        INNER JOIN Evento e ON s.idEvento = e.idEvento
        INNER JOIN Usuario u ON s.idUsuario = u.idUsuario
        LEFT JOIN Administrador a ON s.idAdministrador = a.idAdministrador
        WHERE (p_idSolicitud IS NULL OR p_idSolicitud = 0 OR s.idSolicitud = p_idSolicitud)
          AND (p_idEvento IS NULL OR p_idEvento = 0 OR s.idEvento = p_idEvento)
          AND (p_idUsuario IS NULL OR p_idUsuario = 0 OR u.idUsuario = p_idUsuario)
          AND (p_idAdminAtendio IS NULL OR p_idAdminAtendio = 0 OR s.idAdministrador = p_idAdminAtendio)
          AND (p_tipo IS NULL OR TRIM(p_tipo) = '' OR s.tipo = p_tipo)
          AND (p_estado IS NULL OR TRIM(p_estado) = '' OR s.estado = p_estado)
          AND (p_fechaInicio IS NULL OR s.fechaSolicitud >= p_fechaInicio)
          AND (p_fechaFin IS NULL OR s.fechaSolicitud <= p_fechaFin)
        ORDER BY s.fechaSolicitud DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_cambiarContrasenaAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_cambiarContrasenaAdmin`(IN `p_idAdministrador` INT, IN `p_contrasenaActual` VARCHAR(255), IN `p_contrasenaNueva` VARCHAR(255))
BEGIN
    DECLARE v_contrasenaBD VARCHAR(255);

    SELECT contrasena INTO v_contrasenaBD
    FROM Administrador WHERE idAdministrador = p_idAdministrador AND activo = TRUE LIMIT 1;

    IF v_contrasenaBD IS NULL THEN
        SELECT 'ERROR_ADMIN_NO_VALIDO' AS mensaje;
    ELSEIF v_contrasenaBD <> p_contrasenaActual THEN
        SELECT 'ERROR_CONTRASENA_INCORRECTA' AS mensaje;
    ELSE
        UPDATE Administrador SET contrasena = p_contrasenaNueva WHERE idAdministrador = p_idAdministrador;
        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_desactivarAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_desactivarAdmin`(IN `p_idAdministrador` INT, IN `p_idAdministradorDesactivar` INT)
BEGIN
    DECLARE v_existe INT DEFAULT 0;
    DECLARE v_dueno BOOLEAN;

    SELECT COUNT(*) INTO v_existe
    FROM Administrador WHERE idAdministrador = p_idAdministradorDesactivar AND activo = TRUE;

    IF v_existe = 0 THEN
        SELECT 'ERROR_ADMIN_NO_EXISTE_O_NO_ACTIVO' AS mensaje;
    ELSEIF p_idAdministrador = p_idAdministradorDesactivar THEN
        SELECT 'ERROR_NO_SE_PUEDE_DESACTIVAR_A_SI_MISMO' AS mensaje;
    ELSE
        SELECT dueno INTO v_dueno
        FROM Administrador WHERE idAdministrador = p_idAdministradorDesactivar LIMIT 1;

        IF v_dueno = TRUE THEN
            SELECT 'ERROR_NO_SE_PUEDE_DESACTIVAR_AL_DUENO' AS mensaje;
        ELSE
            UPDATE Administrador SET activo = FALSE WHERE idAdministrador = p_idAdministradorDesactivar;
            SELECT 'OK' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_desactivarUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_desactivarUsuario`(IN `p_idUsuario` INT)
BEGIN
    IF EXISTS (SELECT 1 FROM Usuario WHERE idUsuario = p_idUsuario AND activo = TRUE) THEN
        UPDATE Usuario SET activo = FALSE WHERE idUsuario = p_idUsuario;
        SELECT 'OK_USUARIO_DESACTIVADO' AS mensaje;
    ELSE
        SELECT 'ERROR_USUARIO_NO_EXISTE_O_INACTIVO' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_eventosNoPagados` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_eventosNoPagados`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            e.idEvento,
            e.titulo,
            e.descripcion,
            e.categoria,
            e.fecha,
            e.ubicacion,
            e.listado,
            e.cancelado,
            e.pagado,
            MIN(z.precio) AS precioMinimo,
            MAX(z.precio) AS precioMaximo,
            SUM(z.capacidad) AS capacidadTotal,
            -- Total recaudado en este evento
            IFNULL(SUM(p.cantidadPagada), 0) AS totalRecaudado,
            org.idUsuario AS organizadorId,
            org.nombre AS organizadorNombre,
            org.correo AS organizadorCorreo,
            org.cuentaBancaria AS cuentaBancariaOrganizador,
            org.banco AS bancoOrganizador
        FROM Evento e
        INNER JOIN Usuario org ON e.idUsuario = org.idUsuario
        LEFT JOIN ZonaEvento z ON e.idEvento = z.idEvento
        LEFT JOIN Orden o ON e.idEvento = o.idEvento
        LEFT JOIN Pago p ON o.idOrden = p.idOrden
        WHERE e.pagado = FALSE
          AND e.cancelado = FALSE
          AND e.fecha < NOW()    -- Solo eventos que ya se realizaron
        GROUP BY e.idEvento, e.titulo, e.descripcion, e.categoria, e.fecha, e.ubicacion,
                 e.listado, e.cancelado, e.pagado,
                 org.idUsuario, org.nombre, org.correo, org.cuentaBancaria, org.banco
        ORDER BY e.fecha DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listaOrdenes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listaOrdenes`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            o.idOrden, o.fechaOrden, o.fechaExpiracion, o.notificacion,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha,
            e.ubicacion AS eventoUbicacion, e.cancelado AS eventoCancelado,
            u.idUsuario, u.nombre AS usuarioNombre, u.correo AS usuarioCorreo
        FROM Orden o
        INNER JOIN Evento e ON o.idEvento = e.idEvento
        INNER JOIN Usuario u ON o.idUsuario = u.idUsuario
        ORDER BY o.fechaOrden DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarAdmins` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarAdmins`(IN `p_idAdmin` INT)
BEGIN
  IF (SELECT dueno FROM Administrador WHERE idAdministrador = p_idAdmin AND activo = TRUE) = TRUE THEN
    SELECT 
      idAdministrador,
      nombre,
      correo,
      dueno,
      activo
    FROM Administrador
    WHERE idAdministrador != p_idAdmin
    ORDER BY dueno DESC, nombre ASC;
  ELSE
    SELECT 'ERROR_NO_AUTORIZADO' AS mensaje;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarEventos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarEventos`(IN `p_idAdministrador` INT)
BEGIN
  IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
    SELECT 
      e.idEvento,
      e.titulo,
      e.descripcion,
      e.categoria,
      e.fecha,
      e.ubicacion,
      e.listado,
      e.cancelado,
      e.rechazado,
      e.motivoRechazo,
      e.suspendido,
      e.motivoSuspension,
      e.pagado,
      MIN(z.precio)    AS precioMinimo,
      MAX(z.precio)    AS precioMaximo,
      SUM(z.capacidad) AS capacidadTotal,
      u.idUsuario      AS organizadorId,
      u.nombre         AS organizadorNombre,
      u.correo         AS organizadorCorreo,
      CASE
        WHEN e.cancelado  = 1 THEN 'cancelado'
        WHEN e.rechazado  = 1 THEN 'rechazado'
        WHEN e.suspendido = 1 THEN 'suspendido'
        WHEN e.listado    = 1 THEN 'publicado'
        ELSE 'pendiente'
      END AS estadoEvento
    FROM Evento e
    INNER JOIN Usuario u    ON e.idUsuario = u.idUsuario
    LEFT JOIN ZonaEvento z ON z.idEvento  = e.idEvento
    GROUP BY e.idEvento
    ORDER BY e.fecha ASC;
  ELSE
    SELECT 'ERROR_ADMIN_NO_VALIDO' AS mensaje;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarImagenePendientesAprobacion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarImagenePendientesAprobacion`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            i.idImagen, i.urlImagen, i.estado, i.fechaSubida, i.portada, i.motivo,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha, e.ubicacion AS eventoUbicacion,
            u.idUsuario AS organizadorId, u.nombre AS organizadorNombre, u.correo AS organizadorCorreo
        FROM ImagenEvento i
        INNER JOIN Evento e ON i.idEvento = e.idEvento
        INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
        WHERE i.fechaAprobacion IS NULL AND i.estado = 'Pendiente'
        ORDER BY i.fechaSubida DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarImagenes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarImagenes`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            i.idImagen, i.urlImagen, i.estado, i.fechaSubida, i.fechaAprobacion, i.portada, i.motivo,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha, e.ubicacion AS eventoUbicacion,
            u.idUsuario AS organizadorId, u.nombre AS organizadorNombre, u.correo AS organizadorCorreo
        FROM ImagenEvento i
        INNER JOIN Evento e ON i.idEvento = e.idEvento
        INNER JOIN Usuario u ON e.idUsuario = u.idUsuario
        ORDER BY i.fechaSubida DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarSolicitudes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarSolicitudes`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            s.idSolicitud, s.tipo, s.causa, s.estado, s.fechaSolicitud, s.fechaResolucion,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha, e.ubicacion AS eventoUbicacion,
            u.idUsuario AS solicitanteId, u.nombre AS solicitanteNombre, u.correo AS solicitanteCorreo,
            a.idAdministrador AS adminAtendioId, a.nombre AS adminAtendioNombre
        FROM solicitudEvento s
        INNER JOIN Evento e ON s.idEvento = e.idEvento
        INNER JOIN Usuario u ON s.idUsuario = u.idUsuario
        LEFT JOIN Administrador a ON s.idAdministrador = a.idAdministrador
        ORDER BY s.fechaSolicitud DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarSolicitudesPendientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarSolicitudesPendientes`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT
            s.idSolicitud, s.tipo, s.causa, s.estado, s.fechaSolicitud,
            e.idEvento, e.titulo AS eventoTitulo, e.categoria, e.fecha AS eventoFecha, e.ubicacion AS eventoUbicacion,
            u.idUsuario AS solicitanteId, u.nombre AS solicitanteNombre, u.correo AS solicitanteCorreo,
            a.idAdministrador AS adminAsignadoId, a.nombre AS adminAsignadoNombre
        FROM solicitudEvento s
        INNER JOIN Evento e ON s.idEvento = e.idEvento
        INNER JOIN Usuario u ON s.idUsuario = u.idUsuario
        LEFT JOIN Administrador a ON s.idAdministrador = a.idAdministrador
        WHERE s.estado = 'Pendiente'
        ORDER BY s.fechaSolicitud DESC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_listarTodosLosUsuarios` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_listarTodosLosUsuarios`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT u.idUsuario, u.nombre, u.correo, u.ine, u.selfie, u.curp, u.cuentaBancaria, u.banco,
               u.eventosMaximos, u.datosVerificados, u.estadoVerificacion, u.activo, u.correoVerificado
        FROM Usuario u ORDER BY u.idUsuario ASC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_Lista_eventosDisponible` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_Lista_eventosDisponible`()
BEGIN
    SELECT
        e.idEvento,
        e.titulo,
        e.descripcion,
        e.categoria,
        e.fecha,
        e.ubicacion,
        e.listado,
        e.cancelado,
        MIN(z.precio) AS precioMinimo,
        MAX(z.precio) AS precioMaximo,
        SUM(z.capacidad) AS capacidadTotal,
        COUNT(DISTINCT b.idBoleto) AS boletosVendidos
    FROM Evento e
    INNER JOIN ZonaEvento z ON e.idEvento = z.idEvento
    LEFT JOIN Boleto b ON z.idZona = b.idZona AND b.estado = 'Activo'
    WHERE e.fecha > NOW() AND e.cancelado = FALSE
    GROUP BY e.idEvento, e.titulo, e.descripcion, e.categoria,
             e.fecha, e.ubicacion, e.listado, e.cancelado
    ORDER BY e.fecha ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_marcaEventoPagado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_marcaEventoPagado`(IN `p_idEvento` INT, IN `p_idAdministrador` INT, IN `p_cantidadDepositada` DECIMAL(10,2))
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        IF EXISTS (
            SELECT 1 FROM Evento
            WHERE idEvento = p_idEvento AND cancelado = FALSE AND fecha < NOW()
        ) THEN
            UPDATE Evento SET pagado = TRUE WHERE idEvento = p_idEvento;

            INSERT INTO ModificacionesEventosListados (modificaciones, motivos, idAdministrador, idEvento)
            VALUES (
                'Evento marcado como pagado',
                CONCAT('Transferencia bancaria realizada. Cantidad depositada: $', p_cantidadDepositada),
                p_idAdministrador,
                p_idEvento
            );
        ELSE
            SELECT 'El evento aun no se ha realizado o esta cancelado.' AS mensaje;
        END IF;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_modificarEventoListado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_modificarEventoListado`(IN `p_idAdministrador` INT, IN `p_idEvento` INT, IN `p_titulo` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_categoria` ENUM('festival','teatro','deporte','corporativo','conferencia'), IN `p_fecha` DATETIME, IN `p_ubicacion` VARCHAR(255), IN `p_listado` BOOLEAN, IN `p_cancelado` BOOLEAN, IN `p_motivos` VARCHAR(255))
BEGIN
    DECLARE v_existe INT;
    DECLARE v_modificaciones TEXT;
    DECLARE v_fechaCancelacion DATETIME;

    SELECT COUNT(*) INTO v_existe FROM Evento WHERE idEvento = p_idEvento;

    IF v_existe = 0 THEN
        SELECT 'ERROR_EVENTO_NO_EXISTE' AS mensaje;
    ELSEIF p_fecha < NOW() THEN
        SELECT 'ERROR_FECHA_INVALIDA' AS mensaje;
    ELSE
        SET v_fechaCancelacion = IF(p_cancelado = TRUE, NOW(), NULL);

        SET v_modificaciones = CONCAT(
            'Titulo: ', IFNULL(p_titulo, ''), ' | ',
            'Categoria: ', IFNULL(p_categoria, ''), ' | ',
            'Fecha: ', p_fecha, ' | ',
            'Ubicacion: ', IFNULL(p_ubicacion, ''), ' | ',
            'Listado: ', p_listado, ' | ',
            'Cancelado: ', p_cancelado
        );

        START TRANSACTION;

        INSERT INTO ModificacionesEventosListados
            (fechaModificacion, modificaciones, fechaCancelacion, motivos, idAdministrador, idEvento)
        VALUES (NOW(), v_modificaciones, v_fechaCancelacion, p_motivos, p_idAdministrador, p_idEvento);

        UPDATE Evento
        SET titulo = p_titulo,
            descripcion = p_descripcion,
            categoria = p_categoria,
            fecha = p_fecha,
            ubicacion = p_ubicacion,
            listado = p_listado,
            cancelado = p_cancelado
        WHERE idEvento = p_idEvento;

        COMMIT;
        SELECT 'OK_EVENTO_MODIFICADO' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_modificarZonaEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_modificarZonaEvento`(IN `p_idAdministrador` INT, IN `p_idZona` INT, IN `p_nombre` VARCHAR(100), IN `p_precio` DECIMAL(10,2), IN `p_capacidad` INT)
BEGIN
    DECLARE v_existeZona INT;
    DECLARE v_adminActivo BOOLEAN;

    SELECT activo INTO v_adminActivo
    FROM Administrador WHERE idAdministrador = p_idAdministrador LIMIT 1;

    IF v_adminActivo IS NULL OR v_adminActivo = FALSE THEN
        SELECT 'ERROR_ADMIN_NO_VALIDO' AS mensaje;
    ELSE
        SELECT COUNT(*) INTO v_existeZona FROM ZonaEvento WHERE idZona = p_idZona;

        IF v_existeZona = 0 THEN
            SELECT 'ERROR_ZONA_NO_EXISTE' AS mensaje;
        ELSEIF p_precio < 0 THEN
            SELECT 'ERROR_PRECIO_INVALIDO' AS mensaje;
        ELSEIF p_capacidad <= 0 THEN
            SELECT 'ERROR_CAPACIDAD_INVALIDA' AS mensaje;
        ELSE
            UPDATE ZonaEvento
            SET nombre = p_nombre, precio = p_precio, capacidad = p_capacidad
            WHERE idZona = p_idZona;

            SELECT 'OK' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_quitarImagenEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_quitarImagenEvento`(IN `p_idImagen` INT)
BEGIN
    DECLARE v_existeImagen INT;
    DECLARE v_idEvento INT;
    DECLARE v_esPortada BOOLEAN;
    DECLARE v_nuevaPortada INT;
    DECLARE v_urlImagen VARCHAR(255);

    SELECT COUNT(*) INTO v_existeImagen FROM ImagenEvento WHERE idImagen = p_idImagen;

    IF v_existeImagen = 0 THEN
        SELECT 'ERROR_IMAGEN_NO_EXISTE' AS mensaje;
    ELSE
        SELECT idEvento, portada, urlImagen INTO v_idEvento, v_esPortada, v_urlImagen
        FROM ImagenEvento WHERE idImagen = p_idImagen LIMIT 1;

        START TRANSACTION;
        DELETE FROM ImagenEvento WHERE idImagen = p_idImagen;

        IF v_esPortada = TRUE THEN
            SELECT idImagen INTO v_nuevaPortada FROM ImagenEvento WHERE idEvento = v_idEvento LIMIT 1;
            IF v_nuevaPortada IS NOT NULL THEN
                UPDATE ImagenEvento SET portada = TRUE WHERE idImagen = v_nuevaPortada;
            END IF;
        END IF;

        COMMIT;
        SELECT 'OK_IMAGEN_ELIMINADA' AS mensaje, v_urlImagen AS urlEliminada;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_registrarNuevoAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_registrarNuevoAdmin`(IN `p_nombre` VARCHAR(100), IN `p_correo` VARCHAR(100), IN `p_contrasena` VARCHAR(255))
BEGIN
    DECLARE v_existe INT DEFAULT 0;

    SELECT COUNT(*) INTO v_existe FROM Administrador WHERE correo = p_correo;

    IF v_existe > 0 THEN
        SELECT 'ERROR_CORREO_EXISTENTE' AS mensaje;
    ELSE
        INSERT INTO Administrador (nombre, correo, contrasena) VALUES (p_nombre, p_correo, p_contrasena);
        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_registrarNuevoUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_registrarNuevoUsuario`(IN `p_nombre` VARCHAR(100), IN `p_correo` VARCHAR(100), IN `p_contrasena` VARCHAR(255), IN `p_ine` VARCHAR(255), IN `p_selfie` VARCHAR(255), IN `p_curp` VARCHAR(18), IN `p_cuentaBancaria` VARCHAR(100), IN `p_banco` VARCHAR(100))
BEGIN
    DECLARE v_estado VARCHAR(20);

    IF EXISTS (SELECT 1 FROM Usuario WHERE correo = p_correo) THEN
        SELECT 'ERROR_CORREO_EXISTENTE' AS mensaje;
    ELSE
        IF p_ine IS NOT NULL OR p_selfie IS NOT NULL OR p_curp IS NOT NULL
           OR p_cuentaBancaria IS NOT NULL OR p_banco IS NOT NULL THEN
            SET v_estado = 'Pendiente';
        ELSE
            SET v_estado = 'Nuevo';
        END IF;

        INSERT INTO Usuario (nombre, correo, contrasena, ine, selfie, curp,
                             cuentaBancaria, banco, estadoVerificacion)
        VALUES (p_nombre, p_correo, p_contrasena, p_ine, p_selfie, p_curp,
                p_cuentaBancaria, p_banco, v_estado);

        SELECT 'OK' AS mensaje, LAST_INSERT_ID() AS idUsuario, v_estado AS estadoVerificacion;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_resolverSolicitudEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_resolverSolicitudEvento`(IN `p_idAdministrador` INT, IN `p_idSolicitud` INT, IN `p_aprobado` BOOLEAN)
BEGIN
    DECLARE v_existe INT;
    DECLARE v_estado VARCHAR(20);
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_idEvento INT;

    SELECT COUNT(*) INTO v_existe FROM solicitudEvento WHERE idSolicitud = p_idSolicitud;

    IF v_existe = 0 THEN
        SELECT 'ERROR_SOLICITUD_NO_EXISTE' AS mensaje;
    ELSE
        SELECT estado, tipo, idEvento INTO v_estado, v_tipo, v_idEvento
        FROM solicitudEvento WHERE idSolicitud = p_idSolicitud LIMIT 1;

        IF v_estado <> 'Pendiente' THEN
            SELECT 'ERROR_SOLICITUD_YA_RESUELTA' AS mensaje;
        ELSE
            START TRANSACTION;

            IF p_aprobado = TRUE THEN
                UPDATE solicitudEvento
                SET estado = 'Aprobada', fechaResolucion = NOW(), idAdministrador = p_idAdministrador
                WHERE idSolicitud = p_idSolicitud;

                IF v_tipo = 'Cancelacion' THEN
                    UPDATE Evento SET cancelado = TRUE WHERE idEvento = v_idEvento;
                END IF;

                COMMIT;
                SELECT 'OK_APROBADO' AS mensaje;
            ELSE
                UPDATE solicitudEvento
                SET estado = 'Rechazada', fechaResolucion = NOW(), idAdministrador = p_idAdministrador
                WHERE idSolicitud = p_idSolicitud;

                COMMIT;
                SELECT 'OK_RECHAZADO' AS mensaje;
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_restablecerContrasenaAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_restablecerContrasenaAdmin`(IN `p_token` VARCHAR(100), IN `p_contrasenaNueva` VARCHAR(255))
BEGIN
    DECLARE v_idAdmin INT DEFAULT NULL;

    SELECT idAdministrador INTO v_idAdmin
    FROM Administrador
    WHERE tokenCambiarContrasena = p_token
      AND fechaExpiracionTokenCambiarContrasena IS NOT NULL
      AND fechaExpiracionTokenCambiarContrasena > NOW()
    LIMIT 1;

    IF v_idAdmin IS NULL THEN
        SELECT 'ERROR_TOKEN_INVALIDO_O_EXPIRADO' AS mensaje;
    ELSE
        UPDATE Administrador
        SET contrasena = p_contrasenaNueva,
            tokenCambiarContrasena = NULL,
            fechaExpiracionTokenCambiarContrasena = NULL
        WHERE idAdministrador = v_idAdmin;

        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_subirImagen` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_subirImagen`(IN `p_idEvento` INT, IN `p_urlImagen` VARCHAR(255), IN `p_portada` BOOLEAN)
BEGIN
    DECLARE v_existeEvento INT;
    DECLARE v_cancelado BOOLEAN;

    SELECT COUNT(*) INTO v_existeEvento FROM Evento WHERE idEvento = p_idEvento;

    IF v_existeEvento = 0 THEN
        SELECT 'ERROR_EVENTO_NO_EXISTE' AS mensaje;
    ELSE
        SELECT cancelado INTO v_cancelado FROM Evento WHERE idEvento = p_idEvento LIMIT 1;

        IF v_cancelado = TRUE THEN
            SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
        ELSE
            START TRANSACTION;

            IF p_portada = TRUE THEN
                UPDATE ImagenEvento SET portada = FALSE WHERE idEvento = p_idEvento;
            END IF;

            INSERT INTO ImagenEvento (urlImagen, estado, fechaAprobacion, portada, idEvento)
            VALUES (p_urlImagen, 'Aprobada', NOW(), p_portada, p_idEvento);

            COMMIT;
            SELECT 'OK_IMAGEN_SUBIDA' AS mensaje, LAST_INSERT_ID() AS idImagen;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_usuariosPendientesVerificacion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_usuariosPendientesVerificacion`(IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT u.idUsuario, u.nombre, u.correo, u.ine, u.selfie, u.curp, u.cuentaBancaria, u.banco,
               u.datosVerificados, u.estadoVerificacion, u.correoVerificado, u.activo
        FROM Usuario u WHERE u.estadoVerificacion = 'Pendiente' ORDER BY u.idUsuario ASC;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Administrador_verDatosUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Administrador_verDatosUsuario`(IN `p_idUsuario` INT, IN `p_idAdministrador` INT)
BEGIN
    IF (SELECT activo FROM Administrador WHERE idAdministrador = p_idAdministrador) = TRUE THEN
        SELECT u.idUsuario, u.nombre, u.correo, u.ine, u.selfie, u.curp, u.cuentaBancaria, u.banco,
               u.eventosMaximos, u.datosVerificados, u.estadoVerificacion, u.activo, u.correoVerificado,
               u.tokenVerificacionCorreo, u.fechaExpiracionTokenVerificacionCorreo,
               u.tokenCambiarContrasena, u.fechaExpiracionTokenCambiarContrasena
        FROM Usuario u WHERE u.idUsuario = p_idUsuario;
    ELSE
        SELECT 'El administrador no esta activo o no existe.' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Adminstrador_verificarUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Adminstrador_verificarUsuario`(IN `p_idUsuario` INT, IN `p_verificado` TINYINT(1))
BEGIN
    DECLARE v_existe INT;

    SELECT COUNT(*) INTO v_existe
    FROM Usuario WHERE idUsuario = p_idUsuario AND activo = TRUE;

    IF v_existe = 0 THEN
        SELECT 'ERROR_USUARIO_NO_VALIDO' AS mensaje;
    ELSE
        IF p_verificado = 1 THEN
            UPDATE Usuario
            SET datosVerificados = TRUE, estadoVerificacion = 'Aprobada'
            WHERE idUsuario = p_idUsuario;
        ELSE
            UPDATE Usuario
            SET datosVerificados = FALSE, estadoVerificacion = 'Rechazada'
            WHERE idUsuario = p_idUsuario;
        END IF;
        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_agregarZonaEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_agregarZonaEvento`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_nombre` VARCHAR(100), IN `p_precio` DECIMAL(10,2), IN `p_capacidad` INT)
BEGIN
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;
    DECLARE v_idUsuarioEvento INT;

    SELECT listado, cancelado, idUsuario
    INTO v_listado, v_cancelado, v_idUsuarioEvento
    FROM Evento WHERE idEvento = p_idEvento LIMIT 1;

    IF v_listado IS NULL THEN
        SELECT 'ERROR_EVENTO_NO_EXISTE' AS mensaje;
    ELSEIF v_idUsuarioEvento <> p_idUsuario THEN
        SELECT 'ERROR_NO_AUTORIZADO' AS mensaje;
    ELSEIF v_cancelado = TRUE THEN
        SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
    ELSEIF v_listado = TRUE THEN
        SELECT 'ERROR_EVENTO_YA_LISTADO' AS mensaje;
    ELSEIF p_precio < 0 THEN
        SELECT 'ERROR_PRECIO_INVALIDO' AS mensaje;
    ELSEIF p_capacidad <= 0 THEN
        SELECT 'ERROR_CAPACIDAD_INVALIDA' AS mensaje;
    ELSE
        INSERT INTO ZonaEvento (nombre, precio, capacidad, idEvento)
        VALUES (p_nombre, p_precio, p_capacidad, p_idEvento);

        SELECT 'OK' AS mensaje, LAST_INSERT_ID() AS idZona;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cambiarContrasena` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cambiarContrasena`(IN `p_idUsuario` INT, IN `p_contrasenaActual` VARCHAR(255), IN `p_contrasenaNueva` VARCHAR(255))
BEGIN
    IF EXISTS (
        SELECT 1 FROM Usuario
        WHERE idUsuario = p_idUsuario
          AND contrasena = p_contrasenaActual
          AND activo = TRUE
    ) THEN
        UPDATE Usuario SET contrasena = p_contrasenaNueva WHERE idUsuario = p_idUsuario;
        SELECT 'OK' AS mensaje;
    ELSE
        SELECT 'ERROR_CREDENCIALES_INVALIDAS' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cambiarPortadaEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cambiarPortadaEvento`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_idImagen` INT)
BEGIN
    DECLARE v_existeEvento INT;
    DECLARE v_existeImagen INT;
    DECLARE v_estadoImagen VARCHAR(20);

    SELECT COUNT(*) INTO v_existeEvento
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario;

    IF v_existeEvento = 0 THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSE
        SELECT COUNT(*) INTO v_existeImagen
        FROM ImagenEvento WHERE idImagen = p_idImagen AND idEvento = p_idEvento;

        IF v_existeImagen = 0 THEN
            SELECT 'ERROR_IMAGEN_NO_VALIDA' AS mensaje;
        ELSE
            SELECT estado INTO v_estadoImagen
            FROM ImagenEvento WHERE idImagen = p_idImagen AND idEvento = p_idEvento LIMIT 1;

            IF v_estadoImagen <> 'Aprobada' THEN
                SELECT 'ERROR_IMAGEN_NO_APROBADA' AS mensaje;
            ELSE
                START TRANSACTION;
                UPDATE ImagenEvento SET portada = FALSE WHERE idEvento = p_idEvento;
                UPDATE ImagenEvento SET portada = TRUE WHERE idImagen = p_idImagen;
                COMMIT;
                SELECT 'OK' AS mensaje;
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cambiarPortadaEventoAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cambiarPortadaEventoAdmin`(IN `p_idEvento` INT, IN `p_idImagen` INT)
BEGIN
    DECLARE v_idEventoImagen INT;

    SELECT idEvento INTO v_idEventoImagen
    FROM ImagenEvento WHERE idImagen = p_idImagen LIMIT 1;

    IF v_idEventoImagen IS NULL THEN
        SELECT 'ERROR_IMAGEN_NO_EXISTE' AS mensaje;
    ELSEIF v_idEventoImagen <> p_idEvento THEN
        SELECT 'ERROR_IMAGEN_NO_PERTENECE_AL_EVENTO' AS mensaje;
    ELSE
        UPDATE ImagenEvento SET portada = FALSE WHERE idEvento = p_idEvento;
        UPDATE ImagenEvento SET portada = TRUE WHERE idImagen = p_idImagen;
        SELECT 'OK_PORTADA_CAMBIADA' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cancelarEventoNoListado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cancelarEventoNoListado`(IN `p_idUsuario` INT, IN `p_idEvento` INT)
BEGIN
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;

    SELECT listado, cancelado INTO v_listado, v_cancelado
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario LIMIT 1;

    IF v_listado IS NULL THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSEIF v_cancelado = TRUE THEN
        SELECT 'ERROR_EVENTO_YA_CANCELADO' AS mensaje;
    ELSEIF v_listado = TRUE THEN
        SELECT 'ERROR_EVENTO_LISTADO' AS mensaje;
    ELSE
        UPDATE Evento SET cancelado = TRUE WHERE idEvento = p_idEvento;
        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cancelarSolicitudEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cancelarSolicitudEvento`(IN `p_idUsuario` INT, IN `p_idSolicitud` INT)
BEGIN
    DECLARE v_existe INT;
    DECLARE v_estado VARCHAR(20);

    SELECT COUNT(*) INTO v_existe
    FROM solicitudEvento WHERE idSolicitud = p_idSolicitud AND idUsuario = p_idUsuario;

    IF v_existe = 0 THEN
        SELECT 'ERROR_SOLICITUD_NO_VALIDA' AS mensaje;
    ELSE
        SELECT estado INTO v_estado
        FROM solicitudEvento WHERE idSolicitud = p_idSolicitud AND idUsuario = p_idUsuario;

        IF v_estado <> 'Pendiente' THEN
            SELECT 'ERROR_SOLICITUD_NO_PENDIENTE' AS mensaje;
        ELSE
            UPDATE solicitudEvento
            SET estado = 'Cancelada', fechaResolucion = NOW()
            WHERE idSolicitud = p_idSolicitud;

            SELECT 'OK' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_comprarBoletos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_comprarBoletos`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_idZona` INT, IN `p_cantidad` INT)
BEGIN
    DECLARE v_usuarioExiste INT;
    DECLARE v_capacidadZona INT;
    DECLARE v_precioZona DECIMAL(10,2);
    DECLARE v_idEventoZona INT;
    DECLARE v_boletosVendidosEnZona INT;
    DECLARE v_idOrden INT;
    DECLARE i INT DEFAULT 0;

    -- Validar usuario activo
    SELECT COUNT(*) INTO v_usuarioExiste
    FROM Usuario WHERE idUsuario = p_idUsuario AND activo = TRUE;

    IF v_usuarioExiste = 0 THEN
        SELECT 'ERROR_USUARIO_NO_VALIDO' AS mensaje;

    ELSEIF p_cantidad <= 0 THEN
        SELECT 'ERROR_CANTIDAD_INVALIDA' AS mensaje;

    ELSE
        START TRANSACTION;

        -- Bloquear zona para evitar race conditions
        SELECT capacidad, precio, idEvento
        INTO v_capacidadZona, v_precioZona, v_idEventoZona
        FROM ZonaEvento
        WHERE idZona = p_idZona
        FOR UPDATE;

        -- Validar que la zona exista y pertenezca al evento indicado
        IF v_capacidadZona IS NULL THEN
            ROLLBACK;
            SELECT 'ERROR_ZONA_NO_EXISTE' AS mensaje;

        ELSEIF v_idEventoZona <> p_idEvento THEN
            ROLLBACK;
            SELECT 'ERROR_ZONA_NO_PERTENECE_AL_EVENTO' AS mensaje;

        ELSE
            -- Validar que el evento este listado y activo
            IF NOT EXISTS (
                SELECT 1 FROM Evento
                WHERE idEvento = p_idEvento AND cancelado = FALSE AND listado = TRUE
            ) THEN
                ROLLBACK;
                SELECT 'ERROR_EVENTO_NO_DISPONIBLE' AS mensaje;

            ELSE
                -- Contar boletos activos o en reserva de esta zona especifica
                SELECT COUNT(*) INTO v_boletosVendidosEnZona
                FROM Boleto b
                INNER JOIN Orden o ON b.idOrden = o.idOrden
                WHERE b.idZona = p_idZona
                  AND b.estado IN ('Activo', 'Reserva');

                IF (v_boletosVendidosEnZona + p_cantidad) > v_capacidadZona THEN
                    ROLLBACK;
                    SELECT 'ERROR_SIN_DISPONIBILIDAD' AS mensaje;

                ELSE
                    -- Crear orden
                    INSERT INTO Orden (idEvento, idUsuario, fechaExpiracion)
                    VALUES (p_idEvento, p_idUsuario, NOW() + INTERVAL 10 MINUTE);

                    SET v_idOrden = LAST_INSERT_ID();

                    -- Generar boletos para esta zona
                    WHILE i < p_cantidad DO
                        INSERT INTO Boleto (codigoQR, estado, idOrden, idZona)
                        VALUES (UUID(), 'Reserva', v_idOrden, p_idZona);
                        SET i = i + 1;
                    END WHILE;

                    COMMIT;
                    SELECT 'OK' AS mensaje, v_idOrden AS idOrden, v_precioZona AS precioPorBoleto;
                END IF;
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crearEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crearEvento`(IN `p_idUsuario` INT, IN `p_titulo` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_categoria` ENUM('festival','teatro','deporte','corporativo','conferencia'), IN `p_fecha` DATETIME, IN `p_ubicacion` VARCHAR(255))
BEGIN
    DECLARE v_existe INT;
    DECLARE v_verificado BOOLEAN;
    DECLARE v_eventosActuales INT;
    DECLARE v_eventosMaximos INT;

    -- Validar que la fecha sea futura
    IF p_fecha <= NOW() THEN
        SELECT 'ERROR_FECHA_INVALIDA' AS mensaje;

    ELSE
        -- Validar que el usuario exista y esté activo
        SELECT COUNT(*) INTO v_existe
        FROM Usuario
        WHERE idUsuario = p_idUsuario AND activo = TRUE;

        IF v_existe = 0 THEN
            SELECT 'ERROR_USUARIO_NO_VALIDO' AS mensaje;
        ELSE
            -- Obtener si el usuario está verificado y su límite de eventos
            SELECT datosVerificados, eventosMaximos
            INTO v_verificado, v_eventosMaximos
            FROM Usuario
            WHERE idUsuario = p_idUsuario;

            IF v_verificado = FALSE THEN
                SELECT 'ERROR_USUARIO_NO_VERIFICADO' AS mensaje;
            ELSE
                -- Contar eventos activos (no cancelados, no rechazados, no suspendidos)
                SELECT COUNT(*) INTO v_eventosActuales
                FROM Evento
                WHERE idUsuario = p_idUsuario
                  AND cancelado = FALSE
                  AND rechazado = FALSE
                  AND suspendido = FALSE;

                IF v_eventosActuales >= v_eventosMaximos THEN
                    SELECT 'ERROR_LIMITE_EVENTOS' AS mensaje;
                ELSE
                    -- Insertar el nuevo evento con flags inicializados en 0
                    INSERT INTO Evento (
                        titulo, descripcion, categoria, fecha, ubicacion,
                        listado, cancelado, rechazado, suspendido, pagado, idUsuario
                    )
                    VALUES (
                        p_titulo, p_descripcion, p_categoria, p_fecha, p_ubicacion,
                        0, 0, 0, 0, 0, p_idUsuario
                    );

                    SELECT 'OK' AS mensaje, LAST_INSERT_ID() AS idEvento;
                END IF;
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_descargarBoleto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_descargarBoleto`(IN `p_idUsuario` INT, IN `p_idBoleto` INT)
BEGIN
    DECLARE v_existe INT;

    SELECT COUNT(*) INTO v_existe
    FROM Boleto b
    INNER JOIN Orden o ON b.idOrden = o.idOrden
    WHERE b.idBoleto = p_idBoleto
      AND o.idUsuario = p_idUsuario
      AND b.estado = 'Activo';

    IF v_existe = 0 THEN
        SELECT 'ERROR_BOLETO_NO_DISPONIBLE' AS mensaje;
    ELSE
        SELECT
            b.idBoleto,
            b.codigoQR,
            b.estado,
            o.idOrden,
            o.fechaOrden,
            u.idUsuario,
            u.nombre AS nombreUsuario,
            u.correo AS correoUsuario,
            e.idEvento,
            e.titulo AS tituloEvento,
            e.fecha AS fechaEvento,
            e.ubicacion AS ubicacionEvento,
            e.categoria AS categoriaEvento,
            z.idZona,
            z.nombre AS nombreZona,
            z.precio AS precioUnitario
        FROM Boleto b
        INNER JOIN Orden o ON b.idOrden = o.idOrden
        INNER JOIN Usuario u ON o.idUsuario = u.idUsuario
        INNER JOIN Evento e ON o.idEvento = e.idEvento
        INNER JOIN ZonaEvento z ON b.idZona = z.idZona
        WHERE b.idBoleto = p_idBoleto AND o.idUsuario = p_idUsuario;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_eliminarZonaEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminarZonaEvento`(IN `p_idUsuario` INT, IN `p_idZona` INT)
BEGIN
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;
    DECLARE v_idUsuarioEvento INT;
    DECLARE v_idEvento INT;
    DECLARE v_totalZonas INT;

    SELECT e.listado, e.cancelado, e.idUsuario, e.idEvento
    INTO v_listado, v_cancelado, v_idUsuarioEvento, v_idEvento
    FROM ZonaEvento z
    INNER JOIN Evento e ON z.idEvento = e.idEvento
    WHERE z.idZona = p_idZona LIMIT 1;

    IF v_listado IS NULL THEN
        SELECT 'ERROR_ZONA_NO_EXISTE' AS mensaje;
    ELSEIF v_idUsuarioEvento <> p_idUsuario THEN
        SELECT 'ERROR_NO_AUTORIZADO' AS mensaje;
    ELSEIF v_cancelado = TRUE THEN
        SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
    ELSEIF v_listado = TRUE THEN
        SELECT 'ERROR_EVENTO_YA_LISTADO' AS mensaje;
    ELSE
        SELECT COUNT(*) INTO v_totalZonas FROM ZonaEvento WHERE idEvento = v_idEvento;

        IF v_totalZonas <= 1 THEN
            SELECT 'ERROR_MINIMO_UNA_ZONA' AS mensaje;
        ELSE
            DELETE FROM ZonaEvento WHERE idZona = p_idZona;
            SELECT 'OK' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_emitirRecibo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_emitirRecibo`(IN `p_idOrden` INT)
BEGIN
    DECLARE v_existe INT;

    SELECT COUNT(*) INTO v_existe FROM Pago WHERE idOrden = p_idOrden;

    IF v_existe = 0 THEN
        SELECT 'ERROR_ORDEN_SIN_PAGO' AS mensaje;
    ELSE
        SELECT
            o.idOrden,
            o.fechaOrden,
            p.fechaPago,
            u.nombre AS nombreUsuario,
            u.correo,
            e.titulo AS evento,
            e.fecha AS fechaEvento,
            e.ubicacion,
            e.categoria,
            z.idZona,
            z.nombre AS nombreZona,
            z.precio AS precioPorBoleto,
            COUNT(b.idBoleto) AS cantidadBoletosEnZona,
            (COUNT(b.idBoleto) * z.precio) AS subtotalZona,
            p.cantidadPagada AS totalPagado
        FROM Orden o
        INNER JOIN Usuario u ON o.idUsuario = u.idUsuario
        INNER JOIN Evento e ON o.idEvento = e.idEvento
        INNER JOIN Pago p ON o.idOrden = p.idOrden
        INNER JOIN Boleto b ON b.idOrden = o.idOrden
        INNER JOIN ZonaEvento z ON b.idZona = z.idZona
        WHERE o.idOrden = p_idOrden
          AND b.estado IN ('Activo', 'Inactivo')
        GROUP BY o.idOrden, o.fechaOrden, p.fechaPago, u.nombre, u.correo,
                 e.titulo, e.fecha, e.ubicacion, e.categoria,
                 z.idZona, z.nombre, z.precio, p.cantidadPagada;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_generarTokenRestablecerContrasenaAdmin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generarTokenRestablecerContrasenaAdmin`(IN `p_correo` VARCHAR(100))
BEGIN
    DECLARE v_idAdmin INT;
    DECLARE v_token VARCHAR(100);
    DECLARE v_expiracion DATETIME;

    SELECT idAdministrador INTO v_idAdmin
    FROM Administrador WHERE correo = p_correo AND activo = TRUE LIMIT 1;

    IF v_idAdmin IS NULL THEN
        SELECT 'ERROR' AS mensaje;
    ELSE
        SET v_token = CONCAT(UUID(), '-', FLOOR(RAND()*10000));
        SET v_expiracion = NOW() + INTERVAL 1 HOUR;

        UPDATE Administrador
        SET tokenCambiarContrasena = v_token,
            fechaExpiracionTokenCambiarContrasena = v_expiracion
        WHERE idAdministrador = v_idAdmin;

        SELECT 'OK' AS mensaje, v_token AS token, v_expiracion AS expiracion;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_generarTokenRestablecerContrasenaUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generarTokenRestablecerContrasenaUsuario`(IN `p_correo` VARCHAR(100))
BEGIN
    DECLARE v_idUsuario INT;
    DECLARE v_token VARCHAR(100);
    DECLARE v_expiracion DATETIME;

    SELECT idUsuario INTO v_idUsuario
    FROM Usuario WHERE correo = p_correo AND activo = TRUE LIMIT 1;

    IF v_idUsuario IS NULL THEN
        SELECT 'ERROR' AS mensaje;
    ELSE
        SET v_token = CONCAT(UUID(), '-', FLOOR(RAND()*10000));
        SET v_expiracion = NOW() + INTERVAL 1 HOUR;

        UPDATE Usuario
        SET tokenCambiarContrasena = v_token,
            fechaExpiracionTokenCambiarContrasena = v_expiracion
        WHERE idUsuario = v_idUsuario;

        SELECT 'OK' AS mensaje, v_token AS token, v_expiracion AS expiracion;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_generarTokenVerificacionCorreo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generarTokenVerificacionCorreo`(IN `p_idUsuario` INT)
BEGIN
    DECLARE v_correoVerificado BOOLEAN;
    DECLARE v_token VARCHAR(255);
    DECLARE v_expiracion DATETIME;

    SELECT correoVerificado INTO v_correoVerificado
    FROM Usuario WHERE idUsuario = p_idUsuario AND activo = TRUE LIMIT 1;

    IF v_correoVerificado IS NULL THEN
        SELECT 'ERROR_USUARIO_NO_VALIDO' AS mensaje;
    ELSEIF v_correoVerificado = TRUE THEN
        SELECT 'ERROR_CORREO_YA_VERIFICADO' AS mensaje;
    ELSE
        SET v_token = CONCAT(UUID(), '-', FLOOR(RAND()*10000));
        SET v_expiracion = NOW() + INTERVAL 1 HOUR;

        UPDATE Usuario
        SET tokenVerificacionCorreo = v_token,
            fechaExpiracionTokenVerificacionCorreo = v_expiracion
        WHERE idUsuario = p_idUsuario;

        SELECT 'OK' AS mensaje, v_token AS token, v_expiracion AS expiracion;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_listarEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_listarEvento`(IN `p_idUsuario` INT, IN `p_idEvento` INT)
BEGIN
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;
    DECLARE v_tieneZonas INT;

    SELECT listado, cancelado INTO v_listado, v_cancelado
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario LIMIT 1;

    IF v_listado IS NULL THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSEIF v_cancelado = TRUE THEN
        SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
    ELSEIF v_listado = TRUE THEN
        SELECT 'ERROR_EVENTO_YA_LISTADO' AS mensaje;
    ELSE
        -- Validar que tenga al menos una zona configurada antes de publicar
        SELECT COUNT(*) INTO v_tieneZonas FROM ZonaEvento WHERE idEvento = p_idEvento;

        IF v_tieneZonas = 0 THEN
            SELECT 'ERROR_SIN_ZONAS_CONFIGURADAS' AS mensaje;
        ELSE
            UPDATE Evento SET listado = TRUE WHERE idEvento = p_idEvento;
            SELECT 'OK' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_boletosPorOrden` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_boletosPorOrden`(IN `p_idOrden` INT)
BEGIN
    SELECT
        b.idBoleto,
        b.codigoQR,
        b.estado AS estadoBoleto,
        e.idEvento,
        e.titulo AS eventoTitulo,
        e.categoria AS eventoCategoria,
        e.fecha AS eventoFecha,
        e.ubicacion AS eventoUbicacion,
        z.idZona,
        z.nombre AS nombreZona,
        z.precio AS precioBoleto,
        o.idOrden,
        o.fechaOrden,
        u.idUsuario,
        u.nombre AS usuarioNombre,
        u.correo AS usuarioCorreo
    FROM Boleto b
    INNER JOIN Orden o ON b.idOrden = o.idOrden
    INNER JOIN Evento e ON o.idEvento = e.idEvento
    INNER JOIN Usuario u ON o.idUsuario = u.idUsuario
    INNER JOIN ZonaEvento z ON b.idZona = z.idZona
    WHERE b.idOrden = p_idOrden;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_detallesOrden` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_detallesOrden`(IN `p_idOrden` INT)
BEGIN
    SELECT
        o.idOrden,
        o.fechaOrden,
        o.fechaExpiracion,
        o.notificacion,
        e.idEvento,
        e.titulo AS eventoTitulo,
        e.categoria AS eventoCategoria,
        e.fecha AS eventoFecha,
        e.ubicacion AS eventoUbicacion,
        e.cancelado AS eventoCancelado,
        u.idUsuario,
        u.nombre AS usuarioNombre,
        u.correo AS usuarioCorreo,
        p.idPago,
        p.fechaPago,
        p.cantidadPagada,
        b.idBoleto,
        b.codigoQR,
        b.estado AS estadoBoleto,
        z.idZona,
        z.nombre AS nombreZona,
        z.precio AS precioZona
    FROM Orden o
    INNER JOIN Usuario u ON o.idUsuario = u.idUsuario
    INNER JOIN Evento e ON o.idEvento = e.idEvento
    LEFT JOIN Pago p ON o.idOrden = p.idOrden
    LEFT JOIN Boleto b ON o.idOrden = b.idOrden
    LEFT JOIN ZonaEvento z ON b.idZona = z.idZona
    WHERE o.idOrden = p_idOrden;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_eventosCompradosUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_eventosCompradosUsuario`(IN `p_idUsuario` INT)
BEGIN
    SELECT
        e.idEvento,
        e.titulo,
        e.categoria,
        e.fecha,
        e.ubicacion,
        o.idOrden,
        o.fechaOrden,
        CASE WHEN p.idPago IS NOT NULL THEN 'Pagado' ELSE 'No Pagado' END AS estadoPago
    FROM Orden o
    INNER JOIN Evento e ON o.idEvento = e.idEvento
    LEFT JOIN Pago p ON o.idOrden = p.idOrden
    WHERE o.idUsuario = p_idUsuario;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_eventosCreadosPorUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_eventosCreadosPorUsuario`(IN `p_idUsuario` INT)
BEGIN
  IF (SELECT datosVerificados FROM Usuario WHERE idUsuario = p_idUsuario) = FALSE THEN
    SELECT 'ERROR_USUARIO_NO_VERIFICADO' AS mensaje;
  ELSE
    SELECT 
      e.idEvento,
      e.titulo,
      e.descripcion,
      e.categoria,
      e.fecha,
      e.ubicacion,
      e.listado,
      e.cancelado,
      e.rechazado,
      e.motivoRechazo,
      e.pagado,
      MIN(z.precio)    AS precioMinimo,
      MAX(z.precio)    AS precioMaximo,
      SUM(z.capacidad) AS capacidadTotal,
      CASE
        WHEN e.cancelado = 1 THEN 'Cancelado'
        WHEN e.rechazado = 1 THEN 'Rechazado'
        WHEN e.listado   = 1 THEN 'Publicado'
        ELSE 'Borrador'
      END AS estadoEvento
    FROM Evento e
    LEFT JOIN ZonaEvento z ON z.idEvento = e.idEvento
    WHERE e.idUsuario = p_idUsuario
    GROUP BY e.idEvento
    ORDER BY e.fecha ASC;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_eventosDisponiblesUsuarios` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_eventosDisponiblesUsuarios`()
BEGIN
    SELECT
        e.idEvento,
        e.titulo,
        e.descripcion,
        e.categoria,
        e.fecha,
        e.ubicacion,
        MIN(z.precio) AS precioMinimo,
        MAX(z.precio) AS precioMaximo,
        SUM(z.capacidad) AS capacidadTotal,
        COUNT(DISTINCT b.idBoleto) AS boletosVendidos,
        -- Imagen de portada si existe
        (SELECT ie.urlImagen FROM ImagenEvento ie
         WHERE ie.idEvento = e.idEvento AND ie.portada = TRUE AND ie.estado = 'Aprobada'
         LIMIT 1) AS imagenPortada
    FROM Evento e
    INNER JOIN ZonaEvento z ON e.idEvento = z.idEvento
    LEFT JOIN Boleto b ON z.idZona = b.idZona AND b.estado IN ('Activo', 'Reserva')
    WHERE e.fecha > NOW()
      AND e.cancelado = FALSE
      AND e.suspendido = FALSE
      AND e.rechazado = FALSE
      AND e.listado = TRUE
    GROUP BY e.idEvento, e.titulo, e.descripcion, e.categoria, e.fecha, e.ubicacion
    ORDER BY e.fecha ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_eventosPendientesUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_eventosPendientesUsuario`(IN `p_idUsuario` INT)
BEGIN
    IF (SELECT datosVerificados FROM Usuario WHERE idUsuario = p_idUsuario) = TRUE THEN
        SELECT
            e.idEvento,
            e.titulo,
            e.descripcion,
            e.categoria,
            e.fecha,
            e.ubicacion,
            e.listado,
            e.cancelado,
            MIN(z.precio) AS precioMinimo,
            MAX(z.precio) AS precioMaximo,
            SUM(z.capacidad) AS capacidadTotal,
            'Pendiente' AS estadoEvento
        FROM Evento e
        LEFT JOIN ZonaEvento z ON e.idEvento = z.idEvento
        WHERE e.idUsuario = p_idUsuario
          AND e.cancelado = FALSE
          AND e.fecha >= NOW()
        GROUP BY e.idEvento, e.titulo, e.descripcion, e.categoria,
                 e.fecha, e.ubicacion, e.listado, e.cancelado
        ORDER BY e.fecha ASC;
    ELSE
        SELECT 'ERROR_USUARIO_NO_VERIFICADO' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_eventosProximosUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_eventosProximosUsuario`(IN `p_idUsuario` INT)
BEGIN
    SELECT
        e.idEvento,
        e.titulo,
        e.categoria,
        e.fecha,
        e.ubicacion,
        o.idOrden,
        o.fechaOrden,
        COUNT(b.idBoleto) AS boletosComprados,
        SUM(p.cantidadPagada) AS totalPagado
    FROM Orden o
    INNER JOIN Evento e ON o.idEvento = e.idEvento
    INNER JOIN Pago p ON o.idOrden = p.idOrden
    INNER JOIN Boleto b ON o.idOrden = b.idOrden
    WHERE o.idUsuario = p_idUsuario
      AND e.fecha > NOW()
      AND e.cancelado = FALSE
    GROUP BY e.idEvento, e.titulo, e.categoria, e.fecha, e.ubicacion, o.idOrden, o.fechaOrden;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_obtenerPerfilUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_obtenerPerfilUsuario`(IN `p_idUsuario` INT)
BEGIN
    SELECT idUsuario, nombre, correo, ine, selfie, curp, cuentaBancaria, banco,
           eventosMaximos, datosVerificados, estadoVerificacion, activo, correoVerificado
    FROM Usuario WHERE idUsuario = p_idUsuario;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_perfilOtroUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_perfilOtroUsuario`(IN `p_idUsuario` INT)
BEGIN
    SELECT
        u.idUsuario,
        u.nombre AS usuarioNombre,
        u.datosVerificados,
        COUNT(e.idEvento) AS eventosRealizados
    FROM Usuario u
    LEFT JOIN Evento e ON u.idUsuario = e.idUsuario
        AND e.cancelado = FALSE AND e.fecha < NOW()
    WHERE u.idUsuario = p_idUsuario
    GROUP BY u.idUsuario, u.nombre, u.datosVerificados;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_Lista_zonasEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Lista_zonasEvento`(IN `p_idEvento` INT)
BEGIN
    SELECT
        z.idZona,
        z.nombre,
        z.precio,
        z.capacidad AS capacidadTotal,
        COUNT(b.idBoleto) AS boletosVendidos,
        (z.capacidad - COUNT(b.idBoleto)) AS boletosDisponibles
    FROM ZonaEvento z
    LEFT JOIN Boleto b ON z.idZona = b.idZona AND b.estado IN ('Activo', 'Reserva')
    WHERE z.idEvento = p_idEvento
    GROUP BY z.idZona, z.nombre, z.precio, z.capacidad
    ORDER BY z.precio ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_login_admin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_admin`(IN `p_correo` VARCHAR(100), IN `p_contrasena` VARCHAR(255))
BEGIN
    SELECT idAdministrador, nombre, correo, dueno, activo
    FROM Administrador
    WHERE correo = p_correo AND contrasena = p_contrasena AND activo = TRUE
    LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_login_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login_usuario`(IN `p_correo` VARCHAR(100), IN `p_contrasena` VARCHAR(255))
BEGIN
    SELECT 
        idUsuario,
        nombre,
        correo,
        datosVerificados,
        estadoVerificacion,
        correoVerificado,
        activo
    FROM Usuario
    WHERE correo = p_correo
      AND contrasena = p_contrasena
      AND activo = TRUE
    LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_marcarOrdenNotificada` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_marcarOrdenNotificada`(IN `p_idOrden` INT)
BEGIN
    UPDATE Orden SET notificacion = TRUE WHERE idOrden = p_idOrden;
    SELECT CONCAT('La orden ', p_idOrden, ' fue marcada como notificada.') AS mensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_modificarEventoNoListado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_modificarEventoNoListado`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_titulo` VARCHAR(100), IN `p_descripcion` TEXT, IN `p_categoria` ENUM('festival','teatro','deporte','corporativo','conferencia'), IN `p_fecha` DATETIME, IN `p_ubicacion` VARCHAR(255))
BEGIN
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;

    SELECT listado, cancelado INTO v_listado, v_cancelado
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario LIMIT 1;

    IF v_listado IS NULL THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSEIF v_cancelado = TRUE THEN
        SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
    ELSEIF v_listado = TRUE THEN
        SELECT 'ERROR_EVENTO_LISTADO' AS mensaje;
    ELSE
        UPDATE Evento
        SET titulo = p_titulo,
            descripcion = p_descripcion,
            categoria = p_categoria,
            fecha = p_fecha,
            ubicacion = p_ubicacion
        WHERE idEvento = p_idEvento;

        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_modificarZonaEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_modificarZonaEvento`(IN `p_idUsuario` INT, IN `p_idZona` INT, IN `p_nombre` VARCHAR(100), IN `p_precio` DECIMAL(10,2), IN `p_capacidad` INT)
BEGIN
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;
    DECLARE v_idUsuarioEvento INT;

    SELECT e.listado, e.cancelado, e.idUsuario
    INTO v_listado, v_cancelado, v_idUsuarioEvento
    FROM ZonaEvento z
    INNER JOIN Evento e ON z.idEvento = e.idEvento
    WHERE z.idZona = p_idZona LIMIT 1;

    IF v_listado IS NULL THEN
        SELECT 'ERROR_ZONA_NO_EXISTE' AS mensaje;
    ELSEIF v_idUsuarioEvento <> p_idUsuario THEN
        SELECT 'ERROR_NO_AUTORIZADO' AS mensaje;
    ELSEIF v_cancelado = TRUE THEN
        SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
    ELSEIF v_listado = TRUE THEN
        SELECT 'ERROR_EVENTO_YA_LISTADO' AS mensaje;
    ELSEIF p_precio < 0 THEN
        SELECT 'ERROR_PRECIO_INVALIDO' AS mensaje;
    ELSEIF p_capacidad <= 0 THEN
        SELECT 'ERROR_CAPACIDAD_INVALIDA' AS mensaje;
    ELSE
        UPDATE ZonaEvento
        SET nombre = p_nombre, precio = p_precio, capacidad = p_capacidad
        WHERE idZona = p_idZona;

        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_quitarImagenEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_quitarImagenEvento`(IN `p_idUsuario` INT, IN `p_idImagen` INT)
BEGIN
    DECLARE v_existeImagen INT;
    DECLARE v_idEvento INT;
    DECLARE v_esPortada BOOLEAN;
    DECLARE v_nuevaPortada INT;
    DECLARE v_urlImagen VARCHAR(255);

    SELECT COUNT(*) INTO v_existeImagen
    FROM ImagenEvento ie
    INNER JOIN Evento e ON ie.idEvento = e.idEvento
    WHERE ie.idImagen = p_idImagen AND e.idUsuario = p_idUsuario;

    IF v_existeImagen = 0 THEN
        SELECT 'ERROR_IMAGEN_NO_VALIDA' AS mensaje;
    ELSE
        SELECT ie.idEvento, ie.portada, ie.urlImagen
        INTO v_idEvento, v_esPortada, v_urlImagen
        FROM ImagenEvento ie
        INNER JOIN Evento e ON ie.idEvento = e.idEvento
        WHERE ie.idImagen = p_idImagen AND e.idUsuario = p_idUsuario LIMIT 1;

        START TRANSACTION;
        DELETE FROM ImagenEvento WHERE idImagen = p_idImagen;

        IF v_esPortada = TRUE THEN
            SELECT idImagen INTO v_nuevaPortada
            FROM ImagenEvento WHERE idEvento = v_idEvento LIMIT 1;

            IF v_nuevaPortada IS NOT NULL THEN
                UPDATE ImagenEvento SET portada = TRUE WHERE idImagen = v_nuevaPortada;
            END IF;
        END IF;

        COMMIT;
        SELECT 'OK' AS mensaje, v_urlImagen AS urlEliminada;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrarPago` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrarPago`(IN `p_idOrden` INT, IN `p_cantidadPagada` DECIMAL(10,2))
BEGIN
    DECLARE v_existeOrden INT;
    DECLARE v_yaPagado INT;

    START TRANSACTION;

    SELECT COUNT(*) INTO v_existeOrden
    FROM Orden WHERE idOrden = p_idOrden AND fechaExpiracion > NOW();

    IF v_existeOrden = 0 THEN
        ROLLBACK;
        SELECT 'ERROR_ORDEN_INVALIDA_O_EXPIRADA' AS mensaje;
    ELSE
        SELECT COUNT(*) INTO v_yaPagado FROM Pago WHERE idOrden = p_idOrden;

        IF v_yaPagado > 0 THEN
            ROLLBACK;
            SELECT 'ERROR_ORDEN_YA_PAGADA' AS mensaje;
        ELSE
            INSERT INTO Pago (idOrden, cantidadPagada) VALUES (p_idOrden, p_cantidadPagada);

            UPDATE Boleto SET estado = 'Activo'
            WHERE idOrden = p_idOrden AND estado = 'Reserva';

            COMMIT;
            SELECT 'OK' AS mensaje;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrarse` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrarse`(IN `p_nombre` VARCHAR(100), IN `p_correo` VARCHAR(100), IN `p_contrasena` VARCHAR(255), IN `p_ine` VARCHAR(255), IN `p_selfie` VARCHAR(255), IN `p_curp` VARCHAR(18), IN `p_cuentaBancaria` VARCHAR(100), IN `p_banco` VARCHAR(100))
BEGIN
    DECLARE v_estado VARCHAR(20);

    /*
        p_ine, p_selfie, p_curp, p_cuentaBancaria y p_banco son opcionales.
        Si el usuario no quiere ser organizador mandarlos como NULL (sin comillas).
    */

    IF EXISTS (SELECT 1 FROM Usuario WHERE correo = p_correo) THEN
        SELECT 'ERROR_CORREO_EXISTENTE' AS mensaje;
    ELSE
        IF p_ine IS NOT NULL OR p_selfie IS NOT NULL OR p_curp IS NOT NULL
           OR p_cuentaBancaria IS NOT NULL OR p_banco IS NOT NULL THEN
            SET v_estado = 'Pendiente';
        ELSE
            SET v_estado = 'Nuevo';
        END IF;

        INSERT INTO Usuario (nombre, correo, contrasena, ine, selfie, curp,
                             cuentaBancaria, banco, estadoVerificacion)
        VALUES (p_nombre, p_correo, p_contrasena, p_ine, p_selfie, p_curp,
                p_cuentaBancaria, p_banco, v_estado);

        SELECT 'OK' AS mensaje,
               LAST_INSERT_ID() AS idUsuario,
               v_estado AS estadoVerificacion;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_restablecerContrasena` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_restablecerContrasena`(IN `p_token` VARCHAR(100), IN `p_contrasenaNueva` VARCHAR(255))
BEGIN
    DECLARE v_idUsuario INT DEFAULT NULL;

    SELECT idUsuario INTO v_idUsuario
    FROM Usuario
    WHERE tokenCambiarContrasena = p_token
      AND fechaExpiracionTokenCambiarContrasena IS NOT NULL
      AND fechaExpiracionTokenCambiarContrasena > NOW()
    LIMIT 1;

    IF v_idUsuario IS NULL THEN
        SELECT 'ERROR_TOKEN_INVALIDO_O_EXPIRADO' AS mensaje;
    ELSE
        UPDATE Usuario
        SET contrasena = p_contrasenaNueva,
            tokenCambiarContrasena = NULL,
            fechaExpiracionTokenCambiarContrasena = NULL
        WHERE idUsuario = v_idUsuario;

        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_solicitarCancelarEventoListado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_solicitarCancelarEventoListado`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_causa` VARCHAR(255))
BEGIN
    DECLARE v_existe INT;
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;
    DECLARE v_yaExisteSolicitud INT;

    SELECT COUNT(*) INTO v_existe
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario;

    IF v_existe = 0 THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSE
        SELECT listado, cancelado INTO v_listado, v_cancelado
        FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario;

        IF v_cancelado = TRUE THEN
            SELECT 'ERROR_EVENTO_YA_CANCELADO' AS mensaje;
        ELSEIF v_listado = FALSE THEN
            SELECT 'ERROR_EVENTO_NO_LISTADO' AS mensaje;
        ELSE
            SELECT COUNT(*) INTO v_yaExisteSolicitud
            FROM solicitudEvento
            WHERE idEvento = p_idEvento AND tipo = 'Cancelacion' AND estado = 'Pendiente';

            IF v_yaExisteSolicitud > 0 THEN
                SELECT 'ERROR_YA_EXISTE_SOLICITUD' AS mensaje;
            ELSE
                INSERT INTO solicitudEvento (idEvento, idUsuario, tipo, causa, estado)
                VALUES (p_idEvento, p_idUsuario, 'Cancelacion', p_causa, 'Pendiente');
                SELECT 'OK' AS mensaje;
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_solicitarModificarEventoListado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_solicitarModificarEventoListado`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_causa` VARCHAR(255))
BEGIN
    DECLARE v_existe INT;
    DECLARE v_listado BOOLEAN;
    DECLARE v_cancelado BOOLEAN;
    DECLARE v_yaExisteSolicitud INT;

    SELECT COUNT(*) INTO v_existe
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario;

    IF v_existe = 0 THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSE
        SELECT listado, cancelado INTO v_listado, v_cancelado
        FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario;

        IF v_cancelado = TRUE THEN
            SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
        ELSEIF v_listado = FALSE THEN
            SELECT 'ERROR_EVENTO_NO_LISTADO' AS mensaje;
        ELSE
            SELECT COUNT(*) INTO v_yaExisteSolicitud
            FROM solicitudEvento
            WHERE idEvento = p_idEvento AND tipo = 'Modificacion' AND estado = 'Pendiente';

            IF v_yaExisteSolicitud > 0 THEN
                SELECT 'ERROR_YA_EXISTE_SOLICITUD' AS mensaje;
            ELSE
                INSERT INTO solicitudEvento (idEvento, idUsuario, tipo, causa, estado)
                VALUES (p_idEvento, p_idUsuario, 'Modificacion', p_causa, 'Pendiente');
                SELECT 'OK' AS mensaje;
            END IF;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_subirImagenEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_subirImagenEvento`(IN `p_idUsuario` INT, IN `p_idEvento` INT, IN `p_urlImagen` VARCHAR(255), IN `p_portada` BOOLEAN)
BEGIN
    DECLARE v_existeEvento INT;
    DECLARE v_cancelado BOOLEAN;

    SELECT COUNT(*) INTO v_existeEvento
    FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario;

    IF v_existeEvento = 0 THEN
        SELECT 'ERROR_EVENTO_NO_VALIDO' AS mensaje;
    ELSE
        SELECT cancelado INTO v_cancelado
        FROM Evento WHERE idEvento = p_idEvento AND idUsuario = p_idUsuario LIMIT 1;

        IF v_cancelado = TRUE THEN
            SELECT 'ERROR_EVENTO_CANCELADO' AS mensaje;
        ELSE
            START TRANSACTION;

            IF p_portada = TRUE THEN
                UPDATE ImagenEvento SET portada = FALSE WHERE idEvento = p_idEvento;
            END IF;

            INSERT INTO ImagenEvento (urlImagen, estado, portada, idEvento)
            VALUES (p_urlImagen, 'Pendiente', p_portada, p_idEvento);

            COMMIT;
            SELECT 'OK' AS mensaje, LAST_INSERT_ID() AS idImagen;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_usarBoleto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_usarBoleto`(IN `p_codigoQR` VARCHAR(100), IN `p_idEvento` INT)
BEGIN
    DECLARE v_estado VARCHAR(20);

    SELECT b.estado INTO v_estado
    FROM Boleto b
    INNER JOIN Orden o ON b.idOrden = o.idOrden
    WHERE b.codigoQR = p_codigoQR AND o.idEvento = p_idEvento LIMIT 1;

    IF v_estado IS NULL THEN
        SELECT 'ERROR_BOLETO_NO_EXISTE_EN_EVENTO' AS mensaje;
    ELSEIF v_estado <> 'Activo' THEN
        SELECT 'ERROR_BOLETO_NO_VALIDO' AS mensaje;
    ELSE
        UPDATE Boleto b
        INNER JOIN Orden o ON b.idOrden = o.idOrden
        SET b.estado = 'Inactivo'
        WHERE b.codigoQR = p_codigoQR AND o.idEvento = p_idEvento;

        SELECT 'OK_BOLETO_USADO' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_verificarCorreo` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verificarCorreo`(IN `p_idUsuario` INT, IN `p_token` VARCHAR(100))
BEGIN
    DECLARE v_existe INT;

    SELECT COUNT(*) INTO v_existe
    FROM Usuario
    WHERE idUsuario = p_idUsuario
      AND tokenVerificacionCorreo = p_token
      AND fechaExpiracionTokenVerificacionCorreo >= NOW();

    IF v_existe = 0 THEN
        SELECT 'ERROR_TOKEN_INVALIDO_O_EXPIRADO' AS mensaje;
    ELSE
        UPDATE Usuario
        SET correoVerificado = TRUE,
            tokenVerificacionCorreo = NULL,
            fechaExpiracionTokenVerificacionCorreo = NULL
        WHERE idUsuario = p_idUsuario;

        SELECT 'OK' AS mensaje;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_verificarse` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_verificarse`(IN `p_idUsuario` INT, IN `p_ine` VARCHAR(255), IN `p_selfie` VARCHAR(255), IN `p_curp` VARCHAR(18), IN `p_cuentaBancaria` VARCHAR(100), IN `p_banco` VARCHAR(100))
BEGIN
    DECLARE v_correoVerificado BOOLEAN;
    DECLARE v_datosVerificados BOOLEAN;

    SELECT correoVerificado, datosVerificados
    INTO v_correoVerificado, v_datosVerificados
    FROM Usuario WHERE idUsuario = p_idUsuario AND activo = TRUE LIMIT 1;

    IF v_correoVerificado IS NULL THEN
        SELECT 'ERROR_USUARIO_NO_VALIDO' AS mensaje;
    ELSEIF v_correoVerificado = FALSE THEN
        SELECT 'ERROR_CORREO_NO_VERIFICADO' AS mensaje;
    ELSEIF v_datosVerificados = TRUE THEN
        SELECT 'ERROR_USUARIO_YA_VERIFICADO' AS mensaje;
    ELSEIF p_ine IS NULL OR p_selfie IS NULL OR p_curp IS NULL
           OR p_cuentaBancaria IS NULL OR p_banco IS NULL THEN
        SELECT 'ERROR_DATOS_INCOMPLETOS' AS mensaje;
    ELSE
        UPDATE Usuario
        SET ine = p_ine,
            selfie = p_selfie,
            curp = p_curp,
            cuentaBancaria = p_cuentaBancaria,
            banco = p_banco,
            datosVerificados = FALSE,
            estadoVerificacion = 'Pendiente'
        WHERE idUsuario = p_idUsuario;

        SELECT 'OK' AS mensaje;
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

-- Dump completed on 2026-04-16 18:00:56
