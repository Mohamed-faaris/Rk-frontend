export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const STORAGE_KEY = 'rk_log_level';

const getDefaultLevel = (): LogLevel => {
  const envLevel = import.meta.env.VITE_LOG_LEVEL?.toUpperCase();
  if (envLevel === 'DEBUG') return LogLevel.DEBUG;
  if (envLevel === 'INFO') return LogLevel.INFO;
  if (envLevel === 'WARN') return LogLevel.WARN;
  if (envLevel === 'ERROR') return LogLevel.ERROR;
  return import.meta.env.PROD ? LogLevel.ERROR : LogLevel.DEBUG;
};

class Logger {
  private static instance: Logger;
  private level: LogLevel = getDefaultLevel();

  private constructor() {
    this.loadLevel();

    if (typeof window !== 'undefined') {
      (window as any).setLogLevel = (level: number) => {
        this.level = level;
        this.saveLevel();
      };
      (window as any).getLogLevel = () => this.level;
      (window as any).LogLevel = LogLevel;
    }
  }

  private loadLevel() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        this.level = parseInt(stored, 10);
        return;
      }
    } catch {
      // sessionStorage not available
    }
    this.level = getDefaultLevel();
  }

  private saveLevel() {
    try {
      sessionStorage.setItem(STORAGE_KEY, this.level.toString());
    } catch {
      // sessionStorage not available
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  error(...args: unknown[]) {
    if (this.level >= LogLevel.ERROR) console.error('[ERROR]', ...args);
  }

  warn(...args: unknown[]) {
    if (this.level >= LogLevel.WARN) console.warn('[WARN]', ...args);
  }

  info(...args: unknown[]) {
    if (this.level >= LogLevel.INFO) console.info('[INFO]', ...args);
  }

  debug(...args: unknown[]) {
    if (this.level >= LogLevel.DEBUG) console.debug('[DEBUG]', ...args);
  }
}

export const logger = Logger.getInstance();
