SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Vállalkozó tábla
CREATE TABLE `vallalkozo` (
  `vallalkozo_id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb3_hungarian_ci,
  PRIMARY KEY (`vallalkozo_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Felhasználó tábla
CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  PRIMARY KEY (`felhasznalo_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Vállalkozás tábla
CREATE TABLE `vallalkozas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vallalkozas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `helyszin` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `nyitva_tartas` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `vallalkozo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Szolgáltatás tábla
CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int NOT NULL AUTO_INCREMENT,
  `szolgaltatas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `idotartam` int NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozas_id` int NOT NULL,
  PRIMARY KEY (`szolgaltatas_id`),
  FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Időpontok tábla
CREATE TABLE `idopontok` (
  `ido_id` int NOT NULL AUTO_INCREMENT,
  `szabad_ido` datetime NOT NULL,
  `statusz` ENUM('szabad', 'foglalt') COLLATE utf8mb3_hungarian_ci DEFAULT 'szabad',
  `szolgaltatas_id` int NOT NULL,
  PRIMARY KEY (`ido_id`),
  FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Foglalás tábla
CREATE TABLE `foglalasok` (
  `foglalas_id` int NOT NULL AUTO_INCREMENT,
  `szolgaltatas_id` int NOT NULL,
  `ido_id` int NOT NULL,
  `felhasznalo_id` int DEFAULT NULL,
  `statusz` ENUM('szabad', 'foglalt') COLLATE utf8mb3_hungarian_ci DEFAULT 'szabad',
  `foglalas_datum` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`foglalas_id`),
  FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`),
  FOREIGN KEY (`ido_id`) REFERENCES `idopontok` (`ido_id`),
  FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

COMMIT;
