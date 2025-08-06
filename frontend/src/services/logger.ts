import { toast } from "@/hooks/use-toast";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  context?: {
    userId?: string;
    route?: string;
    component?: string;
    action?: string;
  };
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private readonly STORAGE_KEY = 'app_logs';

  private constructor() {
    this.loadLogsFromStorage();
    window.addEventListener('beforeunload', () => this.saveLogsToStorage());
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown, context?: LogEntry['context']): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      context: {
        ...context,
        route: window.location.pathname,
      }
    };
  }

  private store(entry: LogEntry) {
    console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, {
      data: entry.data,
      context: entry.context,
      timestamp: entry.timestamp
    });

    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
  }

  private loadLogsFromStorage() {
    try {
      const storedLogs = localStorage.getItem(this.STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Error loading logs from storage:', error);
    }
  }

  private saveLogsToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs to storage:', error);
    }
  }

  info(message: string, data?: unknown, context?: LogEntry['context']) {
    const entry = this.formatMessage('info', message, data, context);
    this.store(entry);
  }

  warn(message: string, data?: unknown, context?: LogEntry['context']) {
    const entry = this.formatMessage('warn', message, data, context);
    this.store(entry);
    toast({
      title: "Attention",
      description: message,
      variant: "default"
    });
  }

  error(message: string, data?: unknown, context?: LogEntry['context']) {
    const entry = this.formatMessage('error', message, data, context);
    this.store(entry);
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive"
    });
  }

  debug(message: string, data?: unknown, context?: LogEntry['context']) {
    if (import.meta.env?.MODE === 'development') {
      const entry = this.formatMessage('debug', message, data, context);
      this.store(entry);
    }
  }

  getLogs(filter?: { level?: LogLevel; startDate?: Date; endDate?: Date }): LogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (filter?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filter.level);
    }
    
    if (filter?.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= filter.startDate!
      );
    }
    
    if (filter?.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= filter.endDate!
      );
    }
    
    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = Logger.getInstance();