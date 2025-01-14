-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 30. 14:15
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
-- Tábla szerkezet ehhez a táblához `emlekeztetok`
--

CREATE TABLE `emlekeztetok` (
  `emlekezteto_id` int(11) NOT NULL,
  `szolgaltatas_neve` varchar(255) DEFAULT NULL,
  `statusz` varchar(50) DEFAULT NULL,
  `lefoglalt` datetime NOT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
(1, 'Kiss János', 'janos.kiss@example.com', 'jelszo123', '06101234567'),
(2, 'Teszt Felhasználó', 'teszt@felhasznalo.com', 'jelszo123', '06201234567');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int(11) NOT NULL,
  `lefoglalt` datetime NOT NULL,
  `szabad_ido` varchar(255) DEFAULT NULL,
  `idopontok` varchar(255) DEFAULT NULL,
  `nev` varchar(255) DEFAULT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `szolgaltatas_neve` varchar(255) DEFAULT NULL,
  `statusz` varchar(50) DEFAULT NULL,
  `vallalkozas_id` int(11) DEFAULT NULL,
  `vallalkozo_foglalo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `foglalasok`
--

INSERT INTO `foglalasok` (`foglalas_id`, `lefoglalt`, `szabad_ido`, `idopontok`, `nev`, `felhasznalo_id`, `szolgaltatas_neve`, `statusz`, `vallalkozas_id`, `vallalkozo_foglalo_id`) VALUES
(1, '2024-10-01 15:00:00', '15:00-16:00', '2024-10-01 15:00', 'Kiss János', 1, 'Hajvágás', 'lefoglalt', NULL, NULL),
(2, '2024-10-01 15:00:00', '2024-10-01', '15:00', 'Teszt Felhasználó', 1, 'Fodrászat', 'Foglalt', NULL, NULL),
(5, '2024-10-01 15:00:00', '2024-10-01', '15:00', 'Autószerelő Vállalkozó', NULL, 'Fodrászat', 'Foglalt', NULL, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int(11) NOT NULL,
  `vallalkozas_neve` varchar(255) NOT NULL,
  `szolgaltatas_neve` varchar(255) NOT NULL,
  `idotartam` int(11) NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozo_id` int(11) DEFAULT NULL,
  `vallalkozas_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szolgaltatas`
--

INSERT INTO `szolgaltatas` (`szolgaltatas_id`, `vallalkozas_neve`, `szolgaltatas_neve`, `idotartam`, `ar`, `vallalkozo_id`, `vallalkozas_id`) VALUES
(1, 'Péter Fodrász Szalon', 'Hajvágás', 60, 5000.00, 1, NULL),
(2, '', 'Fodrászat', 60, 5000.00, 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozas`
--

CREATE TABLE `vallalkozas` (
  `id` int(11) NOT NULL,
  `vallalkozas_neve` varchar(255) NOT NULL,
  `helyszin` varchar(255) NOT NULL,
  `nyitva_tartas` varchar(255) DEFAULT NULL,
  `szabad_ido` varchar(255) DEFAULT NULL,
  `idopontok` varchar(255) DEFAULT NULL,
  `vallalkozo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozas`
--

INSERT INTO `vallalkozas` (`id`, `vallalkozas_neve`, `helyszin`, `nyitva_tartas`, `szabad_ido`, `idopontok`, `vallalkozo_id`) VALUES
(1, 'Péter Fodrász Szalon', 'Budapest, Fő utca 10.', '09:00-18:00', '15:00-16:00', '2024-10-01 15:00', NULL),
(2, 'Péter Barber', 'Budapest, Kossuth Lajos utca 5.', '10:00-19:00', '16:00-17:00', '2024-10-02 16:00', NULL),
(3, 'Új Fodrászat', 'Budapest', '9:00-18:00', '2024-10-01', '15:00-16:00', 1);

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
  `vallalkozas_neve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozo`
--

INSERT INTO `vallalkozo` (`vallalkozo_id`, `nev`, `email`, `jelszo`, `telefonszam`, `vallalkozas_neve`) VALUES
(1, 'Nagy Péter', 'peter.nagy@example.com', 'jelszo456', '06109876543', 'Péter Fodrász Szalon'),
(2, 'Autószerelő Vállalkozó', 'autoszerelo@example.com', 'jelszo123', '06201234567', 'Autószerelés');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `emlekeztetok`
--
ALTER TABLE `emlekeztetok`
  ADD PRIMARY KEY (`emlekezteto_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

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
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `vallalkozas_id` (`vallalkozas_id`),
  ADD KEY `vallalkozo_foglalo_id` (`vallalkozo_foglalo_id`);

--
-- A tábla indexei `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD PRIMARY KEY (`szolgaltatas_id`),
  ADD KEY `vallalkozo_id` (`vallalkozo_id`),
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
-- AUTO_INCREMENT a táblához `emlekeztetok`
--
ALTER TABLE `emlekeztetok`
  MODIFY `emlekezteto_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `vallalkozo`
--
ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `emlekeztetok`
--
ALTER TABLE `emlekeztetok`
  ADD CONSTRAINT `emlekeztetok_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`),
  ADD CONSTRAINT `foglalasok_ibfk_3` FOREIGN KEY (`vallalkozo_foglalo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`);

--
-- Megkötések a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD CONSTRAINT `szolgaltatas_ibfk_1` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`),
  ADD CONSTRAINT `szolgaltatas_ibfk_2` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`);

--
-- Megkötések a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  ADD CONSTRAINT `vallalkozas_ibfk_1` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
