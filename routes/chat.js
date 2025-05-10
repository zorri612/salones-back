const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const Salon = require("../models/Salon");


router.post("/", async (req, res) => {
    const { message } = req.body;
  
    try {
      // Traer todos los salones desde la BD
      const salones = await Salon.find({}, { _id: 0, __v: 0 });
      const contexto = `Esta es la información actual de los salones:\n${salones.map(s => {
        return `Salón: ${s["Salón"]}, Capacidad: ${s.CAPACIDAD}, Edificio: ${s.EDIFICIO}, Piso: ${s.PISO},
         Tomacorriente: ${s.Tomacorriente}, Movilidad: ${s.Movilidad}, Entorno: ${s.Entorno},
          Equipamiento Tecnológico: ${s["Equipamiento Tecnológico "]}, Tipo de Aula: ${s["Tipo de Aula"]},
           Tipo de mesa: ${s["Tipo de mesa"]}, Tipo de silla: ${s["Tipo de silla"]},
            Tipo de tablero: ${s["Tipo de tablero"]}, Comentarios: ${s.COMENTARIOS}`;
            
      }).join("\n")}`;
  
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Responde solo basándote en los datos que te doy a continuación.\n${contexto}`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
      console.error("Error al llamar a OpenAI:", error.message);
      res.status(500).json({ error: "Error al generar la respuesta del chat." });
    }
  });

module.exports = router;
