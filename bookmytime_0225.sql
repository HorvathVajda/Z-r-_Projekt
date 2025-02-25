-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2025. Feb 25. 14:00
-- Kiszolgáló verziója: 8.0.39
-- PHP verzió: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `bookmytime`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int NOT NULL,
  `nev` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8mb3_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`felhasznalo_id`, `nev`, `email`, `jelszo`, `telefonszam`) VALUES
(1, 'Péter Kiss', 'peter.kiss@example.com', 'password123', '06123456788'),
(2, 'Anna Varga', 'anna.varga@example.com', 'securepass', '06234567890'),
(3, 'Zoltán Farkas', 'zoltan.farkas@example.com', 'strongpass', '06301234568');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int NOT NULL,
  `szolgaltatas_id` int NOT NULL,
  `ido_id` int NOT NULL,
  `felhasznalo_id` int DEFAULT NULL,
  `vallalkozas_id` int DEFAULT NULL,
  `statusz` enum('szabad','foglalt') COLLATE utf8mb3_hungarian_ci DEFAULT 'szabad',
  `foglalas_datum` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idopontok`
--

CREATE TABLE `idopontok` (
  `ido_id` int NOT NULL,
  `szabad_ido` datetime NOT NULL,
  `statusz` enum('szabad','foglalt') COLLATE utf8mb3_hungarian_ci DEFAULT 'szabad',
  `szolgaltatas_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `idopontok`
--

INSERT INTO `idopontok` (`ido_id`, `szabad_ido`, `statusz`, `szolgaltatas_id`) VALUES
(38, '2025-02-20 09:00:00', 'szabad', 1),
(39, '2025-02-20 09:30:00', 'szabad', 1),
(40, '2025-02-20 10:00:00', 'szabad', 2),
(41, '2025-02-20 10:30:00', 'szabad', 2),
(42, '2025-02-20 11:00:00', 'szabad', 3),
(43, '2025-02-20 11:30:00', 'szabad', 3),
(44, '2025-02-20 08:00:00', 'szabad', 4),
(45, '2025-02-20 08:30:00', 'szabad', 4),
(46, '2025-02-20 09:00:00', 'szabad', 5),
(47, '2025-02-20 09:30:00', 'szabad', 5),
(48, '2025-02-20 10:00:00', 'szabad', 6),
(49, '2025-02-20 10:30:00', 'szabad', 6),
(50, '2025-02-20 13:00:00', 'szabad', 7),
(51, '2025-02-20 13:30:00', 'szabad', 7),
(52, '2025-02-20 14:00:00', 'szabad', 8),
(53, '2025-02-20 14:30:00', 'szabad', 8),
(54, '2025-02-20 15:00:00', 'szabad', 9),
(55, '2025-02-20 15:30:00', 'szabad', 9),
(56, '2025-02-20 09:00:00', 'szabad', 10),
(57, '2025-02-20 09:30:00', 'szabad', 10),
(58, '2025-02-20 10:00:00', 'szabad', 11),
(59, '2025-02-20 10:30:00', 'szabad', 11),
(60, '2025-02-20 11:00:00', 'szabad', 12),
(61, '2025-02-20 11:30:00', 'szabad', 12);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int NOT NULL,
  `szolgaltatas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `idotartam` int NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozas_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `szolgaltatas`
--

INSERT INTO `szolgaltatas` (`szolgaltatas_id`, `szolgaltatas_neve`, `idotartam`, `ar`, `vallalkozas_id`) VALUES
(1, 'Hajvágás', 30, 3000.00, 1),
(2, 'Körömfestés', 45, 4000.00, 1),
(3, 'Hajfestés', 60, 5000.00, 1),
(4, 'Autóolaj csere', 60, 15000.00, 2),
(5, 'Motorkerékpár javítás', 120, 25000.00, 2),
(6, 'Gumiabroncs csere', 90, 12000.00, 2),
(7, 'Belső festés', 180, 35000.00, 3),
(8, 'Külső festés', 240, 45000.00, 3),
(9, 'Dekoratív festés', 120, 25000.00, 3),
(10, 'Hajvágás', 30, 3000.00, 5),
(11, 'Körömfestés', 45, 4000.00, 5),
(12, 'Hajformázás', 60, 3500.00, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozas`
--

CREATE TABLE `vallalkozas` (
  `id` int NOT NULL,
  `vallalkozas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `helyszin` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `nyitva_tartas` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `vallalkozo_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozas`
--

INSERT INTO `vallalkozas` (`id`, `vallalkozas_neve`, `helyszin`, `nyitva_tartas`, `category`, `vallalkozo_id`) VALUES
(1, 'Kovács Fodrászat', 'Budapest, Kossuth Lajos utca 10.', 'Hétfőtől Péntekig: 09:00 - 18:00', 'Szépségipar', 1),
(2, 'Szabó Autószerviz', 'Budapest, Petőfi Sándor utca 5.', 'Hétfőtől Szombatig: 08:00 - 20:00', 'Autószerviz', 2),
(3, 'Nagy Festészet', 'Budapest, Andrássy út 30.', 'Hétfőtől Péntekig: 10:00 - 17:00', 'Festészet', 3),
(5, 'pityuka fodraszata', '6033 Városföld Béke 2', 'Hétfőtől Péntekig: 09:00 - 18:00', 'Fodraszat', 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozo`
--

CREATE TABLE `vallalkozo` (
  `vallalkozo_id` int NOT NULL,
  `nev` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb3_hungarian_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozo`
--

INSERT INTO `vallalkozo` (`vallalkozo_id`, `nev`, `email`, `jelszo`, `telefonszam`, `bio`) VALUES
(1, 'János Kovács', 'janos.kovacs@example.com', 'jelszo123', '06123456789', 'Szakértő fodrász, több éves tapasztalattal.'),
(2, 'Erika Szabó', 'erika.szabo@example.com', 'titkosjelszo', '06201234567', 'Professzionális autószerelő, gyors és megbízható szolgáltatás.'),
(3, 'Gábor Nagy', 'gabor.nagy@example.com', 'password456', '06301234567', 'Mindenféle festést vállalok, legyen szó belső vagy külső munkálatokról.'),
(4, 'pista', 'p@g.c', '$2b$10$rpq9D3wlsr7O14qjK8I6pOCDrYL7HQRYgWu6ISqNo/o8mo.GJZ1Nm', '06044444', NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD KEY `fk_felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `fk_vallalkozas_id` (`vallalkozas_id`);

--
-- A tábla indexei `idopontok`
--
ALTER TABLE `idopontok`
  ADD PRIMARY KEY (`ido_id`),
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`),
  ADD KEY `idx_idopontok` (`ido_id`,`szolgaltatas_id`),
  ADD KEY `ido_id` (`ido_id`);

--
-- A tábla indexei `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD PRIMARY KEY (`szolgaltatas_id`),
  ADD KEY `vallalkozas_id` (`vallalkozas_id`),
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`);

--
-- A tábla indexei `vallalkozas`
--
ALTER TABLE `vallalkozas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vallalkozo_id` (`vallalkozo_id`);

--
-- A tábla indexei `vallalkozo`
--
ALTER TABLE `vallalkozo`
  ADD PRIMARY KEY (`vallalkozo_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `ido_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `vallalkozo`
--
ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `fk_felhasznalo_id` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vallalkozas_id` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `idopontok`
--
ALTER TABLE `idopontok`
  ADD CONSTRAINT `idopontok_ibfk_1` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`);

--
-- Megkötések a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD CONSTRAINT `szolgaltatas_ibfk_1` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`);

--
-- Megkötések a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  ADD CONSTRAINT `vallalkozas_ibfk_1` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
