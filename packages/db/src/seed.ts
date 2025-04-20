import { prisma } from "./client";

const seed = async () => {
  await prisma.plan.createMany({
    data: [
      {
        name: "Free",
        price: 0,
        description: "Free plan with limited features",
        interval: "monthly",
        features: ["100MB Storage", "Limited Bandwidth", "Limited Apps"],
      },
      {
        name: "Pro",
        price: 10,
        description: "Pro plan with more features",
        interval: "monthly",
        features: ["100GB Storage", "Accelerated Bandwidth", "Unlimited Apps"],
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
