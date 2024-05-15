const express = require("express");
const router = express.Router();
const dibujosController = require("../controllers/dibujosController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware.authenticateToken, dibujosController.obtenerDibujos);
router.post("/", authMiddleware.authenticateToken, dibujosController.crearDibujo);
router.delete("/:id", authMiddleware.authenticateToken, dibujosController.eliminarDibujo);

module.exports = router;
