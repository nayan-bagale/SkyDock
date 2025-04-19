import moment from "moment";
import path from "path";
import winston from "winston";

interface StackInfo {
  method: string;
  relativePath: string;
  line: string;
  pos: string;
  file: string;
  stack: string;
}

class Logger {
  private static instance: Logger;
  private logger: winston.Logger; // ← Cache the logger instance here
  private lineCount = 1;
  private logFilePath = process.env.LOG_FILE_PATH || "/tmp/logs/server.log";

  private constructor() {
    this.logger = winston.createLogger({
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: this.logFilePath,
          maxsize: 5 * 1024 * 1024,
          maxFiles: 5,
          zippedArchive: true,
          format: this.fileLogFormat(),
        }),
        new winston.transports.Console({
          format: this.fileLogFormat(),
        }),
      ],
      exitOnError: false,
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private fileLogFormat() {
    return winston.format.printf(({ level, message }) => {
      const date = moment().format("DD-MMM-YYYY HH:mm:ss");
      const upperLevel = level.toUpperCase();
      let colorizeLevel = upperLevel;

      if (upperLevel === "ERROR")
        colorizeLevel = `\x1b[31m${upperLevel}\x1b[0m`; // red
      if (upperLevel === "INFO") colorizeLevel = `\x1b[32m${upperLevel}\x1b[0m`; // green

      return `${date} [${this.lineCount++}] ${colorizeLevel} ${message}`;
    });
  }

  private getStackInfo(stackIndex: number): StackInfo | null {
    const stacklist = new Error().stack?.split("\n").slice(3) ?? [];
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

    const s = (stacklist[stackIndex] || stacklist[0]) ?? "";
    const sp = (stackReg.exec(s) || stackReg2.exec(s)) as RegExpExecArray;

    if (sp && sp.length === 5) {
      return {
        method: sp[1] ?? "",
        // relativePath: path.relative(path.join(__dirname, ".."), sp[2] ?? ""),
        relativePath: sp[2] ?? "No file",
        line: sp[3] ?? "",
        pos: sp[4] ?? "",
        file: path.basename(sp[2] ?? ""),
        stack: stacklist.join("\n"),
      };
    }
    return null;
  }

  private formatLogArguments(args: any[]): any {
    args = Array.from(args);
    const stackInfo = this.getStackInfo(1);
    const arrow = "\u276F\u276F\u25B6";

    if (stackInfo) {
      const calleeStr = ` ${stackInfo.relativePath}: [${stackInfo.line}] ${arrow}`;
      //   if (typeof args[0] === "string") {
      //     args[0] = calleeStr + " " + args.join("");
      //   } else {
      //     args.unshift(calleeStr);
      //   }
      if (typeof args[0] === "string") {
        const formattedArgs = args.map((arg) => {
          if (arg instanceof Error) {
            return `\n${arg.stack}`;
          }
          return typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg;
        });
        args[0] = calleeStr + " " + formattedArgs.join(" ");
      }
    }
    return args;
  }

  private formatComplexObjectsLogArguments(args: any[]): any {
    args = Array.from(args);
    const stackInfo = this.getStackInfo(1);
    const arrow = "\u276F\u276F\u25B6";

    const formattedArgs = args.map((arg) => {
      if (arg instanceof Error) {
        return `\n${arg.stack}`;
      }
      if (typeof arg === "object") {
        return "\n" + JSON.stringify(arg, null, 2); // Pretty-print objects
      }
      return String(arg);
    });

    const calleeStr = stackInfo
      ? ` ${stackInfo.relativePath}: [${stackInfo.line}] ${arrow}`
      : "";

    formattedArgs.unshift(calleeStr); // Add the location prefix

    return [formattedArgs.join(" ")];
  }

  public debug(...args: any[]) {
    this.logger.debug.apply(this.logger, this.formatLogArguments(args));
  }

  public log(...args: any[]) {
    this.logger.debug.apply(this.logger, this.formatLogArguments(args));
  }

  public info(...args: any[]) {
    this.logger.info.apply(this.logger, this.formatLogArguments(args));
  }

  public warn(...args: any[]) {
    this.logger.warn.apply(this.logger, this.formatLogArguments(args));
  }

  public error(...args: any[]) {
    this.logger.error.apply(this.logger, this.formatLogArguments(args));
  }

  public stream() {
    return {
      write: (message: string) => {
        this.logger.info(message.trim(), {
          meta: { serverLogs: "server-logs" },
        });
      },
    };
  }
}

export default Logger.getInstance();
