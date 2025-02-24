SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Vállalkozó tábla
CREATE TABLE vallalkozo (
  vallalkozo_id int NOT NULL AUTO_INCREMENT,
  nev varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  email varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  jelszo varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  telefonszam varchar(20) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  bio text COLLATE utf8mb3_hungarian_ci,
  PRIMARY KEY (vallalkozo_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Felhasználó tábla
CREATE TABLE felhasznalo (
  felhasznalo_id int NOT NULL AUTO_INCREMENT,
  nev varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  email varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  jelszo varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  telefonszam varchar(20) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  PRIMARY KEY (felhasznalo_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Vállalkozás tábla
CREATE TABLE vallalkozas (
  id int NOT NULL AUTO_INCREMENT,
  vallalkozas_neve varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  helyszin varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  nyitva_tartas varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  category varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  vallalkozo_id int DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (vallalkozo_id) REFERENCES vallalkozo (vallalkozo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Szolgáltatás tábla
CREATE TABLE szolgaltatas (
  szolgaltatas_id int NOT NULL AUTO_INCREMENT,
  szolgaltatas_neve varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  idotartam int NOT NULL,
  ar decimal(10,2) NOT NULL,
  vallalkozas_id int NOT NULL,
  PRIMARY KEY (szolgaltatas_id),
  FOREIGN KEY (vallalkozas_id) REFERENCES vallalkozas (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Időpontok tábla
CREATE TABLE idopontok (
  ido_id int NOT NULL AUTO_INCREMENT,
  szabad_ido datetime NOT NULL,
  statusz ENUM('szabad', 'foglalt') COLLATE utf8mb3_hungarian_ci DEFAULT 'szabad',
  szolgaltatas_id int NOT NULL,
  PRIMARY KEY (ido_id),
  FOREIGN KEY (szolgaltatas_id) REFERENCES szolgaltatas (szolgaltatas_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Foglalás tábla
CREATE TABLE foglalasok (
  foglalas_id int NOT NULL AUTO_INCREMENT,
  szolgaltatas_id int NOT NULL,
  ido_id int NOT NULL,
  felhasznalo_id int DEFAULT NULL,
  statusz ENUM('szabad', 'foglalt') COLLATE utf8mb3_hungarian_ci DEFAULT 'szabad',
  foglalas_datum datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (foglalas_id),
  FOREIGN KEY (szolgaltatas_id) REFERENCES szolgaltatas (szolgaltatas_id),
  FOREIGN KEY (ido_id) REFERENCES idopontok (ido_id),
  FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo (felhasznalo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- Vállalkozók
INSERT INTO `vallalkozo` (`nev`, `email`, `jelszo`, `telefonszam`, `bio`) VALUES
('János Kovács', 'janos.kovacs@example.com', 'jelszo123', '06123456789', 'Szakértő fodrász, több éves tapasztalattal.'),
('Erika Szabó', 'erika.szabo@example.com', 'titkosjelszo', '06201234567', 'Professzionális autószerelő, gyors és megbízható szolgáltatás.'),
('Gábor Nagy', 'gabor.nagy@example.com', 'password456', '06301234567', 'Mindenféle festést vállalok, legyen szó belső vagy külső munkálatokról.');

-- Felhasználók
INSERT INTO `felhasznalo` (`nev`, `email`, `jelszo`, `telefonszam`) VALUES
('Péter Kiss', 'peter.kiss@example.com', 'password123', '06123456788'),
('Anna Varga', 'anna.varga@example.com', 'securepass', '06234567890'),
('Zoltán Farkas', 'zoltan.farkas@example.com', 'strongpass', '06301234568');

-- Vállalkozások
INSERT INTO `vallalkozas` (`vallalkozas_neve`, `helyszin`, `nyitva_tartas`, `category`, `vallalkozo_id`) VALUES
('Kovács Fodrászat', 'Budapest, Kossuth Lajos utca 10.', 'Hétfőtől Péntekig: 09:00 - 18:00', 'Szépségipar', 1),
('Szabó Autószerviz', 'Budapest, Petőfi Sándor utca 5.', 'Hétfőtől Szombatig: 08:00 - 20:00', 'Autószerviz', 2),
('Nagy Festészet', 'Budapest, Andrássy út 30.', 'Hétfőtől Péntekig: 10:00 - 17:00', 'Festészet', 3);

-- Szolgáltatások
INSERT INTO `szolgaltatas` (`szolgaltatas_neve`, `idotartam`, `ar`, `vallalkozas_id`) VALUES
('Hajvágás', 30, 3000, 1),
('Körömfestés', 45, 4000, 1),
('Autóolaj csere', 60, 15000, 2),
('Motorkerékpár javítás', 120, 25000, 2),
('Belső festés', 180, 35000, 3),
('Külső festés', 240, 45000, 3);

-- Időpontok
INSERT INTO `idopontok` (`szabad_ido`, `statusz`, `szolgaltatas_id`) VALUES
('2025-02-20 09:00:00', 'szabad', 1),
('2025-02-20 09:30:00', 'szabad', 1),
('2025-02-20 10:00:00', 'szabad', 2),
('2025-02-20 08:00:00', 'szabad', 3),
('2025-02-20 09:00:00', 'szabad', 4),
('2025-02-20 13:00:00', 'szabad', 5),
('2025-02-20 15:00:00', 'szabad', 6);

-- Foglalások
INSERT INTO `foglalasok` (`szolgaltatas_id`, `ido_id`, `felhasznalo_id`, `statusz`, `foglalas_datum`) VALUES
(1, 1, 1, 'foglalt', '2025-02-18 12:00:00'),
(2, 3, 2, 'foglalt', '2025-02-19 10:00:00'),
(3, 4, 3, 'foglalt', '2025-02-20 08:00:00');


COMMIT;
