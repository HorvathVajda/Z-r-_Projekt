-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 14. 11:20
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
  `statusz` enum('szabad','foglalt') DEFAULT 'szabad',
  `foglalas_datum` datetime DEFAULT current_timestamp(),
  `foglalo_tipus` enum('felhasznalo','vallalkozo') DEFAULT 'felhasznalo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
  `adoszam` varchar(20) DEFAULT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
  ADD KEY `szolgaltatas_id` (`szolgaltatas_id`),
  ADD KEY `foglalasok_ibfk_3` (`felhasznalo_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `statisztika_ibfk_1` (`vallalkozo_id`);

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
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `idopontok`
--
ALTER TABLE `idopontok`
  MODIFY `ido_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `statisztika`
--
ALTER TABLE `statisztika`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `vallalkozo`
--
ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `foglalasok_ibfk_3` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Megkötések a táblához `idopontok`
--
ALTER TABLE `idopontok`
  ADD CONSTRAINT `idopontok_ibfk_1` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`szolgaltatas_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `statisztika`
--
ALTER TABLE `statisztika`
  ADD CONSTRAINT `statisztika_ibfk_1` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
