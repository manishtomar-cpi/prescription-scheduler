const isTestEnv = process.env.NODE_ENV === "test";

type LogLevel = "info" | "error";

const format = (level: LogLevel, message: string, meta?: unknown): string => {
  const base = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;
  if (!meta) {
    return `${base} ${message}`;
  }
  return `${base} ${message} ${JSON.stringify(meta)}`;
};

export const logger = {
  info(message: string, meta?: unknown): void {
    if (isTestEnv) return; // keep tests quiet
    console.log(format("info", message, meta));
  },
  error(message: string, meta?: unknown): void {
    console.error(format("error", message, meta));
  }
};
