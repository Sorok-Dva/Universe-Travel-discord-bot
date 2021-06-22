/** *****************************************************************************
 *  errors.d.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 9:34 PM
 *  |__   _|/ __/                          Updated: 2021/06/22 11:57 PM
 *     |_| |_____|U*Travel
 ***************************************************************************** */
/**
 * Errors typing
 *
 * @module @ustar_travel/discord-bot
 * */
declare module '@ustar_travel/discord-bot' {
  import { Command } from '@ustar_travel/discord-bot'

  /**
   * Discord Bot Command Error Interface
   *
   * @interface
   */
  export interface CommandError {
    command: Command
    trueCommand: string
    example: string
  }
}
