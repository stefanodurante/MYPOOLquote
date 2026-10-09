type LogContext = Record<string, unknown>;

function write(level: "info" | "error", message: string, context: LogContext = {}) {
  const entry = JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  });
  (level === "error" ? console.error : console.info)(entry);
}

export const logger = {
  info: (message: string, context?: LogContext) => write("info", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};
