/*******************************************************************************
 *  config.d.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 9:34PM
 *  |__   _|/ __/                          Updated: 2021/06/21 12:15 PM
 *     |_| |_____|U*Travel
 ******************************************************************************/
/**
 * Config typing
 *
 * @module @ustar_travel/discord-bot
 * */
declare module '@ustar_travel/discord-bot' {
  /**
   * Discord Bot Command Error Interface
   *
   * @interface
   */
  export interface Config {
    /* Environement of the discord bot */
    env: 'dev' | 'live'

    /* Discord bot token available here  https://discord.com/developers/teams/851167720228913212/information */
    token: string

    /* The discord token of the bot creator (to haves access to some debug commands for the bot) */
    botOwner: string

    /* The discord token of the server owner (to haves access to some admin commands) */
    serverOwner: string

    /* The bot prefix used to handle commands */
    prefix: string
  }

}
