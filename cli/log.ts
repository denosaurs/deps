// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  log,
  reset,
  bold,
  blue,
  yellow,
  red,
  LogRecord,
  LogLevels,
  BaseHandler,
} from "../deps.ts";

export declare interface LogConfig {
  /**
   * Disables logging
   */
  quiet?: boolean;
  /**
   * Enables debugging
   */
  debug?: boolean;
  /**
   * Clear the console on reload events
   */
  fullscreen?: boolean;
}

/**
 * Logger tag
 */
const TAG = "[denon]";

const DEBUG_LEVEL = "DEBUG";
const QUIET_LEVEL = "ERROR";
const DEFAULT_LEVEL = "INFO";

const DEFAULT_HANDLER = "format_fn";

/**
 * Deno logger, but slightly better.
 */
export class ConsoleHandler extends BaseHandler {
  format(record: LogRecord): string {
    let msg= '';
    switch (record.level) {
      case LogLevels.INFO:
        msg += blue(TAG);
        break;
      case LogLevels.WARNING:
        msg += yellow(TAG);
        break;
      case LogLevels.ERROR:
        msg += red(TAG);
        break;
      case LogLevels.CRITICAL:
        msg += bold(red(TAG));
        break;
      default:
        break;
    }
  
    msg += ` ${reset(record.msg)}`
  
    for (const arg of record.args) {
      if (arg instanceof Object) {
        msg += ` ${JSON.stringify(arg)}`;
      } else {
        msg += ` ${String(arg)}`;
      }
    }
    return msg;
  }

  log(msg: string): void {
    console.log(msg);
  }
}

/**
 * Modify default deno logger with configurable
 * log level.
 */
export async function setupLog(): Promise<void> {
  const level = DEFAULT_LEVEL;
  await log.setup({
    handlers: {
      [DEFAULT_HANDLER]: new ConsoleHandler(DEBUG_LEVEL),
    },
    loggers: {
      default: {
        level,
        handlers: [DEFAULT_HANDLER],
      },
    },
  });
}
