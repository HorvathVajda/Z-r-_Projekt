const businessModel = require('../models/businessModel');

// Vállalkozások lekérése
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await businessModel.getAllBusinesses();
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozások betöltésekor.', error });
  }
};

// Új vállalkozás hozzáadása
exports.addBusiness = async (req, res) => {
  try {
    const { name, category, location } = req.body;
    if (!name || !category || !location) {
      return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
    }

    const newBusiness = await businessModel.addNewBusiness(name, category, location);
    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozás hozzáadásakor.', error });
  }
};

// Vállalkozás frissítése
exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Érvénytelen ID.' });
    }

    const business = await businessModel.updateBusiness(id, req.body);
    if (!business) {
      return res.status(404).json({ message: 'Vállalkozás nem található.' });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozás frissítésekor.', error });
  }
};

// Vállalkozás törlése
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Érvénytelen ID.' });
    }

    const business = await businessModel.deleteBusiness(id);
    if (!business) {
      return res.status(404).json({ message: 'Vállalkozás nem található.' });
    }
    res.status(200).json({ message: 'Vállalkozás törölve.' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozás törlésénél.', error });
  }
};

// Kategóriák lekérése
exports.getCategories = async (req, res) => {
  try {
    const categories = await businessModel.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a kategóriák betöltésekor.', error });
  }
};
