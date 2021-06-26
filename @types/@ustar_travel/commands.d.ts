/** ***************************************************************************
 *  commands.d.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 9:48 PM AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/25 8:41 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { Client, Message } from 'discord.js'

declare module '@ustar_travel/discord-bot' {

  /**
   * Options type given to a file command
   * */
  type CommandOptions = {
    config: BotOptions
    client: Client
  }

  /**
   * Command string type guard
   * */
  type CommandString = string & { readonly tag: 'CommandString' }

  /**
   * Allowed commands
   * */
  type CommandName =
    | 'debug'
    | 'invit'
    | 'say'
    | 'servers'
    | 'ping'
    | 'prune'
    | 'reload'
    | 'mute'
    | 'unmute'
    | 'iss'

  /**
   * Command Entity Interface
   * */
  interface CommandEntity<Args> {
    title: CommandName
    desc: string
    usage: string
    args: readonly Args[]
    mandatoryArgs: boolean
    examples: string[]
    run: (
      message: Message,
      args: readonly Args[],
      opts: {
        client: Client
        config: BotOptions
      },
    ) => void | Promise<void>
  }

  /**
   * Discord Bot commands Module List
   * */
  type CommandsModule = Record<CommandName, CommandEntity<unknown>>

  /**
   * Discord Bot Command Type
   */
  export type Command = keyof CommandsModule

  /**
   * Discord Bot Command Instance
   */
  export type CommandInstance<C extends
    keyof CommandsModule> = CommandsModule[C]

  /**
   * Discord bot simple commands list
   */
  export type Commands = Command[]
}
