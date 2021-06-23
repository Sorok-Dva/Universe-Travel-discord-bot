/** ***************************************************************************
 *  cmds/unmute.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 10:08 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:26 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
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
