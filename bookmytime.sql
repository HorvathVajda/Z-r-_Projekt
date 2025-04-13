-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 13. 11:15
-- Kiszolgáló verziója: 10.4.24-MariaDB
-- PHP verzió: 8.1.6

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
  `nev` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`felhasznalo_id`, `nev`, `email`, `jelszo`, `telefonszam`) VALUES
(1, 'asd', 'as@g.c', '$2b$10$rA3PG3AzFIZqzLbaUU73quLQsspSwQ7lE1Cvg/Pf/LnHJ2CcZzXYC', '52591988');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int(11) NOT NULL,
  `szolgaltatas_id` int(11) NOT NULL,
  `ido_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `vallalkozas_id` int(11) DEFAULT NULL,
  `statusz` enum('szabad','foglalt') COLLATE utf8_hungarian_ci DEFAULT 'szabad',
  `foglalas_datum` datetime DEFAULT current_timestamp(),
  `foglalo_tipus` enum('felhasznalo','vallalkozo') COLLATE utf8_hungarian_ci DEFAULT 'felhasznalo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `idopontok`
--

CREATE TABLE `idopontok` (
  `ido_id` int(11) NOT NULL,
  `szabad_ido` datetime NOT NULL,
  `statusz` enum('szabad','foglalt') COLLATE utf8_hungarian_ci DEFAULT 'szabad',
  `szolgaltatas_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `statisztika`
--

CREATE TABLE `statisztika` (
  `id` int(11) NOT NULL,
  `teljesitett_munkak` int(11) DEFAULT NULL,
  `bevetel` int(11) DEFAULT NULL,
  `foglalasok` int(11) DEFAULT NULL,
  `vallalkozo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `statisztika`
--

INSERT INTO `statisztika` (`id`, `teljesitett_munkak`, `bevetel`, `foglalasok`, `vallalkozo_id`) VALUES
(1, 2, 8000, 2, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int(11) NOT NULL,
  `szolgaltatas_neve` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `idotartam` int(11) NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozas_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szolgaltatas`
--

INSERT INTO `szolgaltatas` (`szolgaltatas_id`, `szolgaltatas_neve`, `idotartam`, `ar`, `vallalkozas_id`) VALUES
(1, 'Hajfestés', 30, '4000.00', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozas`
--

CREATE TABLE `vallalkozas` (
  `id` int(11) NOT NULL,
  `vallalkozas_neve` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `helyszin` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `nyitva_tartas` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `vallalkozo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozas`
--

INSERT INTO `vallalkozas` (`id`, `vallalkozas_neve`, `helyszin`, `nyitva_tartas`, `category`, `vallalkozo_id`) VALUES
(1, 'a', '6033 Városföld, Béke 2', '08:00-18:00', 'Fodrászat', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozo`
--

CREATE TABLE `vallalkozo` (
  `vallalkozo_id` int(11) NOT NULL,
  `nev` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `adoszam` varchar(20) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `bio` text COLLATE utf8_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozo`
--

INSERT INTO `vallalkozo` (`vallalkozo_id`, `nev`, `email`, `jelszo`, `telefonszam`, `adoszam`, `bio`) VALUES
(1, 'Horváth Dániel', 'a@g.c', '$2b$10$wdg.0.x55pleGtwZ9sJhvuK/0dsnBERes26U3PLgG0ifCCjKW.K86', '0635050502', NULL, NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD KEY `vallalkozas_id` (`vallalkozas_id`),
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`);

--
-- A tábla indexei `idopontok`
--
ALTER TABLE `idopontok`
  ADD PRIMARY KEY (`ido_id`),
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`);

--
-- A tábla indexei `statisztika`
--
ALTER TABLE `statisztika`
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `fk_vallalkozo_id` (`vallalkozo_id`);

--
-- A tábla indexei `vallalkozo`
--
ALTER TABLE `vallalkozo`
  ADD PRIMARY KEY (`vallalkozo_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `ido_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `statisztika`
--
ALTER TABLE `statisztika`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `vallalkozo`
--
ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `idopontok`
--
ALTER TABLE `idopontok`
  ADD CONSTRAINT `idopontok_ibfk_1` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD CONSTRAINT `szolgaltatas_ibfk_1` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  ADD CONSTRAINT `fk_vallalkozo_id` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
