const db = require('../config/db'); // Ha a db kapcsolatot a config mappában tárolod

// Vállalkozások lekérése
const getAllBusinesses = async () => {
  const [rows] = await db.query("SELECT * FROM vallalkozas");
  return rows;
};

// Új vállalkozás hozzáadása
const addNewBusiness = async (name, category, location) => {
  const [result] = await db.query(
    "INSERT INTO vallalkozas (name, category, location) VALUES (?, ?, ?)",
    [name, category, location]
  );
  return { id: result.insertId, name, category, location };
};

// Vállalkozás frissítése
const updateBusiness = async (id, updates) => {
  const [result] = await db.query(
    "UPDATE vallalkozas SET name = ?, category = ?, location = ? WHERE id = ?",
    [updates.name, updates.category, updates.location, id]
  );
  return result.affectedRows ? { id, ...updates } : null;
};

// Vállalkozás törlése
const deleteBusiness = async (id) => {
  const [result] = await db.query(
    "DELETE FROM vallalkozas WHERE id = ?",
    [id]
  );
  return result.affectedRows ? { message: "Vállalkozás törölve." } : null;
};

// Kategóriák lekérése
const getCategories = async () => {
  const [rows] = await db.query("SELECT DISTINCT category FROM vallalkozas");
  return rows;
};

module.exports = {
  getAllBusinesses,
  addNewBusiness,
  updateBusiness,
  deleteBusiness,
  getCategories
};
