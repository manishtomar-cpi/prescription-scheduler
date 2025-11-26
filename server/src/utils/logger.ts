type LogLevel = "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  [key: string]: unknown;
}

const formatMessage = (level: LogLevel, message: string, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}]`;
  const requestPart = context?.requestId ? ` [reqId=${context.requestId}]` : "";
  const contextPart = context ? ` ${JSON.stringify({ ...context, requestId: undefined })}` : "";
  return `${base}${requestPart} ${message}${contextPart}`;
};

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(formatMessage("info", message, context));
  },
  warn: (message: string, context?: LogContext) => {
    console.warn(formatMessage("warn", message, context));
  },
  error: (message: string, context?: LogContext) => {
    console.error(formatMessage("error", message, context));
  }
};
