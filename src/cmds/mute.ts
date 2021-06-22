/*******************************************************************************
 *  cmds/mute.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 10:07 PM
 *  |__   _|/ __/                          Updated: 2021/06/21 10:11 PM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { Client, Message } from 'discord.js'
import { BotOptions } from '@ustar_travel/discord-bot'
import { errors } from '../core'

exports.run = async (client: Client, message: Message, args: Array<string>, config: BotOptions) => {
  try {

  } catch (e) {
    errors.raiseReply(e, message)
    return null
  }
}
