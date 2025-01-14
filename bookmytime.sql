
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `emlekeztetok` (
  `emlekezteto_id` int(11) NOT NULL,
  `szolgaltatas_neve` varchar(255) DEFAULT NULL,
  `statusz` varchar(50) DEFAULT NULL,
  `lefoglalt` datetime NOT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;



CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;



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


CREATE TABLE `szolgaltatas` (
  `szolgaltatas_id` int(11) NOT NULL,
  `vallalkozas_neve` varchar(255) NOT NULL,
  `szolgaltatas_neve` varchar(255) NOT NULL,
  `idotartam` int(11) NOT NULL,
  `ar` decimal(10,2) NOT NULL,
  `vallalkozo_id` int(11) DEFAULT NULL,
  `vallalkozas_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


CREATE TABLE `vallalkozas` (
  `id` int(11) NOT NULL,
  `vallalkozas_neve` varchar(255) NOT NULL,
  `helyszin` varchar(255) NOT NULL,
  `nyitva_tartas` varchar(255) DEFAULT NULL,
  `szabad_ido` varchar(255) DEFAULT NULL,
  `idopontok` varchar(255) DEFAULT NULL,
  `vallalkozo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


CREATE TABLE `vallalkozo` (
  `vallalkozo_id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(20) DEFAULT NULL,
  `vallalkozas_neve` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

ALTER TABLE `emlekeztetok`
  ADD PRIMARY KEY (`emlekezteto_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);


ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD UNIQUE KEY `email` (`email`);


ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `vallalkozas_id` (`vallalkozas_id`),
  ADD KEY `vallalkozo_foglalo_id` (`vallalkozo_foglalo_id`);

ALTER TABLE `szolgaltatas`
  ADD PRIMARY KEY (`szolgaltatas_id`),
  ADD KEY `vallalkozo_id` (`vallalkozo_id`),
  ADD KEY `vallalkozas_id` (`vallalkozas_id`);


ALTER TABLE `vallalkozas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vallalkozo_id` (`vallalkozo_id`);

ALTER TABLE `vallalkozo`
  ADD PRIMARY KEY (`vallalkozo_id`),
  ADD UNIQUE KEY `email` (`email`);


ALTER TABLE `emlekeztetok`
  MODIFY `emlekezteto_id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `felhasznalo`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;


ALTER TABLE `szolgaltatas`
  MODIFY `szolgaltatas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `vallalkozas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `vallalkozo`
  MODIFY `vallalkozo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `emlekeztetok`
  ADD CONSTRAINT `emlekeztetok_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);


ALTER TABLE `foglalasok`
  ADD CONSTRAINT `foglalasok_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  ADD CONSTRAINT `foglalasok_ibfk_2` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`),
  ADD CONSTRAINT `foglalasok_ibfk_3` FOREIGN KEY (`vallalkozo_foglalo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`);


ALTER TABLE `szolgaltatas`
  ADD CONSTRAINT `szolgaltatas_ibfk_1` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`),
  ADD CONSTRAINT `szolgaltatas_ibfk_2` FOREIGN KEY (`vallalkozas_id`) REFERENCES `vallalkozas` (`id`);


ALTER TABLE `vallalkozas`
  ADD CONSTRAINT `vallalkozas_ibfk_1` FOREIGN KEY (`vallalkozo_id`) REFERENCES `vallalkozo` (`vallalkozo_id`);
COMMIT;
