import { prisma } from "@skydock/db";
import { Request, Response } from "express";
import messages from "../constants/messages";
import { INTERNALERROR } from "../constants/status";
import logger from "../logger";

class SubscriptionPlanController {
  private static instance: SubscriptionPlanController;

  private constructor() {}

  public static getInstance(): SubscriptionPlanController {
    if (!SubscriptionPlanController.instance) {
      SubscriptionPlanController.instance = new SubscriptionPlanController();
    }
    return SubscriptionPlanController.instance;
  }

  async getAllPlans(req: Request, res: Response) {
    try {
      const plans = await prisma.plan.findMany();

      const plansArray = plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        storageLimit: Number(plan.storageLimit),
        description: plan.description,
        interval: plan.interval,
        popular: plan.popular,
        features: plan.features,
      }));

      return res.status(200).json(plansArray);
    } catch (e) {
      logger.error("Error in getting all plans", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }
}

export default SubscriptionPlanController.getInstance();
