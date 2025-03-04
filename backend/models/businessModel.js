const db = require('../config/db'); // Ha a db kapcsolatot a config mappában tárolod

// Vállalkozások lekérése
const getAllBusinesses = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM vallalkozas");
    return rows;
  } catch (err) {
    console.error("Hiba a vállalkozások lekérdezésekor:", err);
    throw err;  // Hibát dobunk, hogy a hívó kód is kezelni tudja
  }
};

// Új vállalkozás hozzáadása
const addNewBusiness = async (name, category, location) => {
  try {
    const [result] = await db.query(
      "INSERT INTO vallalkozas (name, category, location) VALUES (?, ?, ?)",
      [name, category, location]
    );
    return { id: result.insertId, name, category, location };
  } catch (err) {
    console.error("Hiba a vállalkozás hozzáadásakor:", err);
    throw err;
  }
};

// Vállalkozás frissítése
const updateBusiness = async (id, updates) => {
  try {
    const [result] = await db.query(
      "UPDATE vallalkozas SET name = ?, category = ?, location = ? WHERE id = ?",
      [updates.name, updates.category, updates.location, id]
    );
    return result.affectedRows ? { id, ...updates } : null;
  } catch (err) {
    console.error("Hiba a vállalkozás frissítésekor:", err);
    throw err;
  }
};

// Vállalkozás törlése
const deleteBusiness = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM vallalkozas WHERE id = ?",
      [id]
    );
    return result.affectedRows ? { message: "Vállalkozás törölve." } : null;
  } catch (err) {
    console.error("Hiba a vállalkozás törlésekor:", err);
    throw err;
  }
};

// Kategóriák lekérése
const getCategories = async () => {
  try {
    const [rows] = await db.query("SELECT DISTINCT category FROM vallalkozas");
    return rows;
  } catch (err) {
    console.error("Hiba a kategóriák lekérdezésekor:", err);
    throw err;
  }
};

module.exports = {
  getAllBusinesses,
  addNewBusiness,
  updateBusiness,
  deleteBusiness,
  getCategories
};
