import { StorageLimit } from "@skydock/types/enums";
import { prisma } from "./client";

const seed = async () => {
  await prisma.plan.createMany({
    data: [
      {
        id: 1,
        name: "Free",
        price: 0,
        description: "Free plan with limited features",
        interval: "monthly",
        features: ["100MB Storage", "Limited Bandwidth", "Limited Apps"],
        storageLimit: StorageLimit.MB_100,
      },
      {
        id: 2,
        name: "Pro",
        price: 10,
        description: "Pro plan with more features",
        interval: "monthly",
        features: ["10GB Storage", "Accelerated Bandwidth", "Unlimited Apps"],
        storageLimit: StorageLimit.GB_10,
      },
    ],
  });
};

seed()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error("Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
