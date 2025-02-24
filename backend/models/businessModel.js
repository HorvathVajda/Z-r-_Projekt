const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  vallalkozas_neve: { type: String, required: true },
  iranyitoszam: { type: String, required: true },
  varos: { type: String, required: true },
  utca: { type: String, required: true },
  hazszam: { type: String, required: true },
  ajto: { type: String },
  category: { type: String, required: true },
  helyszin: { type: String }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
