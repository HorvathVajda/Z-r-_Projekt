-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 18. 12:35
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

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
  `felhasznalo_id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`felhasznalo_id`, `nev`, `email`, `jelszo`, `telefonszam`) VALUES
(1, 'Péter Kiss', 'peter.kiss@example.com', 'password123', '06123456788'),
(2, 'Anna Varga', 'anna.varga@example.com', 'securepass', '06234567890'),
(3, 'Zoltán Farkas', 'zoltan.farkas@example.com', 'strongpass', '06301234568'),
(4, 'asd', 'asd@g.c', '$2b$10$wXlvwH/UtApaAOjJKvWxmegALKX58TsNUcunXlp8d7r/V/Rh3hGSi', '88971885');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int(11) NOT NULL,
  `szolgaltatas_id` int(11) NOT NULL,
  `ido_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `statusz` enum('szabad','foglalt') DEFAULT 'szabad',
  `foglalas_datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`foglalas_id`, `szolgaltatas_id`, `ido_id`, `felhasznalo_id`, `statusz`, `foglalas_datum`) VALUES
(1, 1, 1, 1, 'foglalt', '2025-02-18 12:00:00'),
(2, 2, 3, 2, 'foglalt', '2025-02-19 10:00:00'),
(3, 3, 4, 3, 'foglalt', '2025-02-20 08:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idopontok`
--

CREATE TABLE `idopontok` (
  `ido_id` int(11) NOT NULL,
  `szabad_ido` datetime NOT NULL,
  `statusz` enum('szabad','foglalt') DEFAULT 'szabad',
  `szolgaltatas_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `idopontok`
--

INSERT INTO `idopontok` (`ido_id`, `szabad_ido`, `statusz`, `szolgaltatas_id`) VALUES
(1, '2025-02-20 09:00:00', 'szabad', 1),
(2, '2025-02-20 09:30:00', 'szabad', 1),
(3, '2025-02-20 10:00:00', 'szabad', 2),
(4, '2025-02-20 08:00:00', 'szabad', 3),
(5, '2025-02-20 09:00:00', 'szabad', 4),
(6, '2025-02-20 13:00:00', 'szabad', 5),
(7, '2025-02-20 15:00:00', 'szabad', 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int(11) NOT NULL,
  `szolgaltatas_neve` varchar(255) NOT NULL,
  `idotartam` int(11) NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozas_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szolgaltatas`
--

INSERT INTO `szolgaltatas` (`szolgaltatas_id`, `szolgaltatas_neve`, `idotartam`, `ar`, `vallalkozas_id`) VALUES
(1, 'Hajvágás', 30, 3000.00, 1),
(2, 'Körömfestés', 45, 4000.00, 1),
(3, 'Autóolaj csere', 60, 15000.00, 2),
(4, 'Motorkerékpár javítás', 120, 25000.00, 2),
(5, 'Belső festés', 180, 35000.00, 3),
(6, 'Külső festés', 240, 45000.00, 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozas`
--

CREATE TABLE `vallalkozas` (
  `id` int(11) NOT NULL,
  `vallalkozas_neve` varchar(255) NOT NULL,
  `helyszin` varchar(255) NOT NULL,
  `nyitva_tartas` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `vallalkozo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozas`
--

INSERT INTO `vallalkozas` (`id`, `vallalkozas_neve`, `helyszin`, `nyitva_tartas`, `category`, `vallalkozo_id`) VALUES
(1, 'Kovács Fodrászat', 'Budapest, Kossuth Lajos utca 10.', 'Hétfőtől Péntekig: 09:00 - 18:00', 'Szépségipar', 1),
(2, 'Szabó Autószerviz', 'Budapest, Petőfi Sándor utca 5.', 'Hétfőtől Szombatig: 08:00 - 20:00', 'Autószerviz', 2),
(3, 'Nagy Festészet', 'Budapest, Andrássy út 30.', 'Hétfőtől Péntekig: 10:00 - 17:00', 'Festészet', 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozo`
--

CREATE TABLE `vallalkozo` (
  `vallalkozo_id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(20) DEFAULT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozo`
--

INSERT INTO `vallalkozo` (`vallalkozo_id`, `nev`, `email`, `jelszo`, `telefonszam`, `bio`) VALUES
(1, 'János Kovács', 'janos.kovacs@example.com', 'jelszo123', '06123456789', 'Szakértő fodrász, több éves tapasztalattal.'),
(2, 'Erika Szabó', 'erika.szabo@example.com', 'titkosjelszo', '06201234567', 'Professzionális autószerelő, gyors és megbízható szolgáltatás.'),
(3, 'Gábor Nagy', 'gabor.nagy@example.com', 'password456', '06301234567', 'Mindenféle festést vállalok, legyen szó belső vagy külső munkálatokról.');

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
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`),
  ADD KEY `ido_id` (`ido_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `idopontok`
--
ALTER TABLE `idopontok`
  ADD PRIMARY KEY (`ido_id`),
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`);

--
-- A tábla indexei `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD PRIMARY KEY (`szolgaltatas_id`),
  ADD KEY `vallalkozas_id` (`vallalkozas_id`);

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
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `ido_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `vallalkozo`
--
ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`),
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`ido_id`) REFERENCES `idopontok` (`ido_id`),
  ADD CONSTRAINT `foglalasok_ibfk_3` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

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
