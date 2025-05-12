import { Profile } from "passport";
import { prisma } from "../config/db";
import email from "../services/email";
import { addMonths } from "../utils/date";

class OAuthHelper {
  constructor() {}

  private emailService = email;

  async createOAuthUser(profile: Profile) {
    return await prisma.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          email: profile?.emails?.[0]?.value as string,
          name: profile.displayName,
          image: profile?.photos?.[0]?.value,
          verified: true,
        },
      });
      await ctx.oAuth.create({
        data: {
          provider: profile.provider,
          providerId: profile.id,
          userId: user.id,
        },
      });
      const startDate = new Date();
      const endDate = addMonths(startDate, 1);
      await ctx.userPlan.create({
        data: {
          userId: user.id,
          planId: 1,
          startDate: startDate,
          endDate: endDate,
          status: "active",
        },
      });
      await ctx.payment.create({
        data: {
          userId: user.id,
          planId: 1,
          amount: 0,
          currency: "INR",
          paymentStatus: "success",
        },
      });

      await this.emailService.sendThankYouForSignUpEmail(
        profile?.emails?.[0]?.value as string
      );

      return user;
    });
  }
}

export default OAuthHelper;
