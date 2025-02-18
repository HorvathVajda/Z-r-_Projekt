const Business = require('../models/businessModel');

// Vállalkozások lekérése
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozások betöltésekor.' });
  }
};

// Vállalkozás hozzáadása
exports.addBusiness = async (req, res) => {
  try {
    const newBusiness = new Business(req.body);
    await newBusiness.save();
    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozás hozzáadásakor.' });
  }
};

// Vállalkozás frissítése
exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!business) {
      return res.status(404).json({ message: 'Vállalkozás nem található.' });
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozás frissítésekor.' });
  }
};

// Vállalkozás törlése
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Vállalkozás nem található.' });
    }
    res.status(200).json({ message: 'Vállalkozás törölve.' });
  } catch (error) {
    res.status(500).json({ message: 'Hiba történt a vállalkozás törlésénél.' });
  }
};
