const express = require("express");
const router = express.Router();
const RoutineController = require("../controllers/RoutineController");

router.get("/", RoutineController.getAll);
router.get("/:id", RoutineController.getById);
router.post("/", RoutineController.create);
router.put("/:id", RoutineController.update);
router.delete("/:id", RoutineController.delete);

module.exports = router;
