// Egyszerű form-ellenőrzés
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Az űrlap beküldésének megakadályozása teszteléshez

    // Hozzáférés a keresési mezők értékeihez
    let szolgaltatas = document.querySelector('input[placeholder="Szolgáltatás"]').value;
    let helyszin = document.querySelector('input[placeholder="Helyszín"]').value;
    let datum = document.querySelector('input[type="date"]').value;
    let idopont = document.querySelector('input[type="time"]').value;

    // Egyszerű konzolos ellenőrzés
    console.log(`Szolgáltatás: ${szolgaltatas}, Helyszín: ${helyszin}, Dátum: ${datum}, Időpont: ${idopont}`);

    // További funkciók (pl.: ajax kérés küldése a szerverre) ide kerülhetnek
});
