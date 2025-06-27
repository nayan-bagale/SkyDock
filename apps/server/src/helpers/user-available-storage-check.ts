import { prisma } from "../config/db";
import logger from "../logger";

export const userAvailableStorageCheck = async (
  userId: string,
  requiredStorage: number
): Promise<boolean> => {
  try {
    const userWithPlan = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        usedStorage: true,
        UserPlan: {
          where: { status: "active" },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            plan: {
              select: {
                storageLimit: true,
              },
            },
          },
        },
      },
    });

    if (!userWithPlan) {
      logger.error("User not found:", userId);
      //   throw new Error("User not found");
      return false;
    }

    const usedStorage = userWithPlan?.usedStorage ?? 0;
    const storageLimit = userWithPlan?.UserPlan[0]?.plan?.storageLimit ?? 0;
    const canUpload = Number(usedStorage) + requiredStorage <= storageLimit;

    if (!canUpload) {
      logger.error(`User ${userId} exceeded storage limit `);
      //   throw new Error(`User ${userId} exceeded storage limit`);
      return false;
    }

    return true;
  } catch (error) {
    // console.error("Error checking user available storage:", error);
    logger.error("Error checking user available storage:", error);
    return false;
  }
};
