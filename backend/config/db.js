const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Betölti a .env fájlt

// MongoDB kapcsolat beállítása
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://<felhasznalonev>:<jelszo>@cluster0.uwswx.mongodb.net/bookmytime', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Sikeres kapcsolat a MongoDB-vel');
  } catch (err) {
    console.error('Hiba a MongoDB kapcsolódásakor:', err);
    process.exit(1); // Kilépés hiba esetén
  }
};

// Kapcsolat létrehozása
connectDB();

// Az exportálás most a kapcsolatot tartalmazza
module.exports = mongoose;
