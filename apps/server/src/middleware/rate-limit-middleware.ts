import { rateLimit } from "express-rate-limit";
import {
  DEFAULT_RATE_LIMIT_MAX,
  DEFAULT_RATE_LIMIT_WINDOW,
} from "../constants";
import { TimeInMs } from "../constants/index";

class RateLimitMiddleware {
  private static instance: RateLimitMiddleware;
  public static getInstance(): RateLimitMiddleware {
    if (!RateLimitMiddleware.instance) {
      RateLimitMiddleware.instance = new RateLimitMiddleware();
    }
    return RateLimitMiddleware.instance;
  }

  public readonly loginLimiter;
  public readonly signupLimiter;
  public readonly sendOTPLimiter;
  public readonly defaultLimiter;
  public readonly verifyOTPLimiter;
  public readonly resetPasswordLimiter;
  public readonly sendVerificationEmailLimiter;
  public readonly strictLimiter;

  private constructor() {
    this.loginLimiter = this.createRateLimitMiddleware(
      TimeInMs.THREE_HOURS,
      10
    );
    this.signupLimiter = this.createRateLimitMiddleware(TimeInMs.ONE_DAY, 5);
    this.sendOTPLimiter = this.createRateLimitMiddleware(
      TimeInMs.FIFTEEN_MINUTES,
      3
    );
    this.verifyOTPLimiter = this.createRateLimitMiddleware(
      TimeInMs.FIFTEEN_MINUTES,
      10
    );
    this.defaultLimiter = this.createRateLimitMiddleware(
      TimeInMs.FIFTEEN_MINUTES,
      50
    );
    this.resetPasswordLimiter = this.createRateLimitMiddleware(
      TimeInMs.FIFTEEN_MINUTES,
      10
    );
    this.sendVerificationEmailLimiter = this.createRateLimitMiddleware(
      TimeInMs.ONE_DAY,
      5
    );
    this.strictLimiter = this.createRateLimitMiddleware(TimeInMs.ONE_MINUTE, 5);
  }

  private createRateLimitMiddleware(
    windowMs: number = DEFAULT_RATE_LIMIT_WINDOW,
    max: number = DEFAULT_RATE_LIMIT_MAX
  ) {
    return rateLimit({
      windowMs, // 15 minutes
      max, // Limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
  }
}

export default RateLimitMiddleware.getInstance();
