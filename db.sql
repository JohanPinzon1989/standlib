-- -----------------------------------------------------

-- Schema db_STANDLIB

-- -----------------------------------------------------

DROP SCHEMA IF EXISTS `db_STANDLIB` ;

-- -----------------------------------------------------

-- Schema db_STANDLIB

-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `db_STANDLIB` DEFAULT CHARACTER SET utf8;

-- -----------------------------------------------------

-- Schema phpmyadmin

-- -----------------------------------------------------

DROP SCHEMA IF EXISTS `phpmyadmin` ;

-- -----------------------------------------------------

-- Schema phpmyadmin

-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;

USE `db_STANDLIB` ;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Pais`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Pais` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Pais` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Pais` VARCHAR(45) NOT NULL,
        `Abreviatura` VARCHAR(5) NOT NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Perfil`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Perfil` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Perfil` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Perfil` VARCHAR(25) NOT NULL,
        `Descripcion` VARCHAR(225) NOT NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Tipo_Identificacion`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Tipo_Identificacion` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Tipo_Identificacion` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Tipo` VARCHAR(40) NOT NULL,
        `Abreviacion` VARCHAR(8) NOT NULL,
        `Descripcion` VARCHAR(255) NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Industria`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Industria` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Industria` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Industria` VARCHAR(150) NOT NULL,
        `Abreviacion` VARCHAR(10) NOT NULL,
        `Descripcion` VARCHAR(255) NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Estado_provincia`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Estado_provincia` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Estado_provincia` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `EstPrv` VARCHAR(150) NOT NULL,
        `Abreviacion` VARCHAR(10) NULL,
        `Longitud` VARCHAR(45) NULL,
        `Latitud` VARCHAR(45) NULL,
        `Pais_Id` INT NOT NULL,
        PRIMARY KEY (`Id`),
        CONSTRAINT `fk_Estado_provincia_Pais1` FOREIGN KEY (`Pais_Id`) REFERENCES `db_STANDLIB`.`Pais` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Estado_Usuarios`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Estado_Usuarios` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Estado_Usuarios` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Estado` VARCHAR(45) NOT NULL,
        `Descripcion` VARCHAR(255) NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Usuarios`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Usuarios` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Usuarios` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `N_identificacion` VARCHAR(60) NOT NULL,
        `Tipo_Identificacion_Id` INT NOT NULL,
        `Nombre` VARCHAR(100) NOT NULL,
        `Apellido` VARCHAR(100) NOT NULL,
        `Email` VARCHAR(100) NOT NULL,
        `Num_Fijo` VARCHAR(15) NULL,
        `Num_Celular` VARCHAR(15) NULL,
        `Estado_provincia_Id` INT NOT NULL,
        `Industria_Id` INT NOT NULL,
        `Fecha_ceacion` DATE NOT NULL,
        `Fecha_eliminacion` DATE NULL,
        `Estado_Usuarios_Id` INT NOT NULL,
        `Perfil_Id` INT NOT NULL,
        `username` VARCHAR(100) NOT NULL,
        `password` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`Id`),
        CONSTRAINT `fk_Usuarios_Tipo_Identificacion` FOREIGN KEY (`Tipo_Identificacion_Id`) REFERENCES `db_STANDLIB`.`Tipo_Identificacion` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fk_Usuarios_Industria1` FOREIGN KEY (`Industria_Id`) REFERENCES `db_STANDLIB`.`Industria` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fk_Usuarios_Estado_provincia1` FOREIGN KEY (`Estado_provincia_Id`) REFERENCES `db_STANDLIB`.`Estado_provincia` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fk_Usuarios_Estado_Usuarios1` FOREIGN KEY (`Estado_Usuarios_Id`) REFERENCES `db_STANDLIB`.`Estado_Usuarios` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fk_Usuarios_Perfil1` FOREIGN KEY (`Perfil_Id`) REFERENCES `db_STANDLIB`.`Perfil` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Organismos`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Organismos` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Organismos` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Organismo` VARCHAR(150) NOT NULL,
        `Abreviacion` VARCHAR(15) NOT NULL,
        `Descripcion` VARCHAR(45) NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Estado_documento`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Estado_documento` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Estado_documento` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Estado` VARCHAR(45) NOT NULL,
        `Descrpcion` VARCHAR(255) NOT NULL,
        PRIMARY KEY (`Id`)
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Documentos`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Documentos` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Documentos` (
        `Id` INT NOT NULL AUTO_INCREMENT,
        `Nombre` VARCHAR(255) NOT NULL,
        `Abreviacion` VARCHAR(25) NOT NULL,
        `Descripcion` VARCHAR(255) NOT NULL,
        `Organismos_Id` INT NOT NULL,
        `Fecha_cargue` DATE NOT NULL,
        `Fecha_vigencia` DATE NULL,
        `Fecha_eliminacion` DATE NULL,
        `Estado_documento_Id` INT NOT NULL,
        PRIMARY KEY (`Id`, `Organismos_Id`),
        CONSTRAINT `fk_Documentos_Organismos1` FOREIGN KEY (`Organismos_Id`) REFERENCES `db_STANDLIB`.`Organismos` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fk_Documentos_Estado_documento1` FOREIGN KEY (`Estado_documento_Id`) REFERENCES `db_STANDLIB`.`Estado_documento` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE = InnoDB;

-- -----------------------------------------------------

-- Table `db_STANDLIB`.`Industria_has_Documentos`

-- -----------------------------------------------------

DROP TABLE IF EXISTS `db_STANDLIB`.`Industria_has_Documentos` ;

CREATE TABLE
    IF NOT EXISTS `db_STANDLIB`.`Industria_has_Documentos` (
        `Industria_Id` INT NOT NULL,
        `Documentos_Id` INT NOT NULL,
        PRIMARY KEY (
            `Industria_Id`,
            `Documentos_Id`
        ),
        CONSTRAINT `fk_Industria_has_Documentos_Industria1` FOREIGN KEY (`Industria_Id`) REFERENCES `db_STANDLIB`.`Industria` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT `fk_Industria_has_Documentos_Documentos1` FOREIGN KEY (`Documentos_Id`) REFERENCES `db_STANDLIB`.`Documentos` (`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE = InnoDB;