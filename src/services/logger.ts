import { toast } from "@/components/ui/use-toast";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private store(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = entry.level === 'error' ? console.error : 
                           entry.level === 'warn' ? console.warn : 
                           entry.level === 'debug' ? console.debug :
                           console.log;
      
      consoleMethod(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.data || '');
    }
  }

  info(message: string, data?: any) {
    const entry = this.formatMessage('info', message, data);
    this.store(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.formatMessage('warn', message, data);
    this.store(entry);
    toast({
      title: "Attention",
      description: message,
      variant: "warning",
    });
  }

  error(message: string, data?: any) {
    const entry = this.formatMessage('error', message, data);
    this.store(entry);
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive",
    });
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.formatMessage('debug', message, data);
      this.store(entry);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();