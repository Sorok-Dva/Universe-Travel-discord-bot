/** ***************************************************************************
 *  errors.d.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/23 9:59 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/25 8:57 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
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
    usage: string
    example: string
  }
}
