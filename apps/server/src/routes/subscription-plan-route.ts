import express from "express";
import planController from "../controllers/subscription-plan-controller";

const router = express.Router();

router.get("/get-all", planController.getAllPlans);

export default router;
