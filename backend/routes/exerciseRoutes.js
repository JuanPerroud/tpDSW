const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/ExerciseController");

router.get("/", ExerciseController.getAll);
router.get("/:id", ExerciseController.getById);
router.post("/", ExerciseController.create);
router.put("/:id", ExerciseController.update);
router.delete("/:id", ExerciseController.delete);

module.exports = router;
