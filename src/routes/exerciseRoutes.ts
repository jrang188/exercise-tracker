import express from "express";
import {
  addUser,
  getUsers,
  addExercise,
  getUserLogs,
} from "../controllers/exerciseControllers";

const router = express.Router();

router.route("/").post(addUser).get(getUsers);
router.post("/:id/exercises", addExercise);
router.get("/:id/logs", getUserLogs);

export default router;
