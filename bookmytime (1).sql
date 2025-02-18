-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2025. Feb 18. 09:33
-- Kiszolgáló verziója: 8.0.39
-- PHP verzió: 8.2.25

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
  `emlekezteto_id` int NOT NULL,
  `szolgaltatas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `statusz` varchar(50) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `lefoglalt` datetime NOT NULL,
  `felhasznalo_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int NOT NULL,
  `lefoglalt` datetime NOT NULL,
  `szabad_ido` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `idopontok` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `nev` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `felhasznalo_id` int DEFAULT NULL,
  `szolgaltatas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `statusz` varchar(50) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `vallalkozas_id` int DEFAULT NULL,
  `vallalkozo_foglalo_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int NOT NULL,
  `vallalkozas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `szolgaltatas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `idotartam` int NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozo_id` int DEFAULT NULL,
  `vallalkozas_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vallalkozas`
--

CREATE TABLE `vallalkozas` (
  `id` int NOT NULL,
  `vallalkozas_neve` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `helyszin` varchar(255) COLLATE utf8mb3_hungarian_ci NOT NULL,
  `nyitva_tartas` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `szabad_ido` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `idopontok` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `vallalkozo_id` int DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb3_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_hungarian_ci;

--
-- A tábla adatainak kiíratása `vallalkozas`
--

INSERT INTO `vallalkozas` (`id`, `vallalkozas_neve`, `helyszin`, `nyitva_tartas`, `szabad_ido`, `idopontok`, `vallalkozo_id`, `category`) VALUES
(24, 'Hair Master', '1051 Budapest, Petőfi Sándor utca 1.', 'H-P: 9:00 - 18:00', '9:00 - 12:00', '2025-02-20 09:00, 2025-02-20 10:00, 2025-02-20 11:00', 1, 'Szépségszalon'),
(25, 'CarFix', '1234 Budapest, Kőbányai Út 12.', 'H-P: 8:00 - 17:00', '13:00 - 17:00', '2025-02-20 13:00, 2025-02-20 14:00, 2025-02-20 15:00', 2, 'Autószerviz'),
(26, 'TechGuru', '1012 Budapest, Váci Út 56.', 'H-P: 10:00 - 19:00', '10:00 - 12:00', '2025-02-20 10:00, 2025-02-20 11:00', 3, 'Számítástechnikai szolgáltatások');

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
(1, 'János Kovács', 'janos.kovacs@email.com', 'asd', '+36123456789', NULL),
(2, 'László Tóth', 'laszlo.toth@email.com', 'asd', '+36123456780', NULL),
(3, 'Mária Kiss', 'maria.kiss@email.com', 'asd', '+36123456781', NULL);

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
  MODIFY `emlekezteto_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `vallalkozas`
--
ALTER TABLE `vallalkozas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT a táblához `vallalkozo`
--
ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
