const express = require("express");
const router = express.Router();
const Salon = require("../models/Salon");

// Obtener todos los salones
router.get("/", async (req, res) => {
  try {
    const salones = await Salon.find({}, "Salón");
    res.json(salones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los salones" });
  }
});

// Obtener un salón por nombre
router.get("/:nombre", async (req, res) => {
  try {
    const salon = await Salon.findOne({ "Salón": req.params.nombre });
    if (!salon) {
      return res.status(404).json({ error: "Salón no encontrado" });
    }
    res.json(salon);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el salón" });
  }
});

module.exports = router;
