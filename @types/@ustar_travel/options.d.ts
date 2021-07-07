/*******************************************************************************
 /*  options.d.ts
 /*   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 /*  | || | |___ \
 /*  | || |_  __) |                         Created: 2021/06/21 9:15 PM
 /*  |__   _|/ __/                          Updated: 2021/06/21 9:31 PM
 /*     |_| |_____|U*Travel
 /******************************************************************************/
/**
 * Options typing
 *
 * @module @ustar_travel/discord-bot
 * */
declare module '@ustar_travel/discord-bot' {
  import { Config } from '@ustar_travel/discord-bot'
  import { HTTPOptions, WebSocketOptions, WSEventType } from 'discord.js'
  
  /**
   * Default Discord.js ClientOptions type
   * @type ClientOptions
   * */
  export type ClientOptions = {
    apiRequestMethod?: string
    shardId?: number
    shardCount?: number
    messageCacheMaxSize?: number
    messageCacheLifetime?: number
    messageSweepInterval?: number
    fetchAllMembers?: boolean
    disableEveryone?: boolean
    sync?: boolean
    restWsBridgeTimeout?: number
    restTimeOffset?: number
    retryLimit?: number
    disabledEvents?: WSEventType[]
    ws?: WebSocketOptions
    http?: HTTPOptions
  };
  
  /**
   * Custom BotOptions type that extends ClientOptions and Config
   * @type BotOptions
   * */
  export type BotOptions = ClientOptions & Config & {
    commandEditableDuration?: number
    nonCommandEditable?: boolean
    invite?: string
  }
}

