/** *****************************************************************************
/*  commands.d.ts
/*   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
/*  | || | |___ \
/*  | || |_  __) |                         Created: 2021/06/21 9:48 PM
/*  |__   _|/ __/                          Updated: 2021/06/21 10:08 PM
/*     |_| |_____|U*Travel
/***************************************************************************** */
/**
 * Commands typing
 *
 * @module @ustar_travel/discord-bot
 * */
declare module '@ustar_travel/discord-bot' {

  /**
   * Discord Bot commands List
   *
   * @typedef Command
   * */
  export type Command = 'debug'
    | 'invit'
    | 'say'
    | 'servers'
    | 'ping'
    | 'prune'
    | 'reload'
    | 'mute'
    | 'unmute'

  /**
   * Discord Bot Command Type
   *
   * @typedef Commands
   */
  export type Commands = Command[]
}
