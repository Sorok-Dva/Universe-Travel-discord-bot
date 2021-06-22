/** *****************************************************************************
 *  cmds/mute.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 10:07 PM
 *  |__   _|/ __/                          Updated: 2021/06/22 11:39 PM
 *     |_| |_____|U*Travel
 /***************************************************************************** */
import { Message } from 'discord.js'
import { BotOptions } from '@ustar_travel/discord-bot'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

exports.run = async (
  message: Message,
  args: Array<string>,
  config: BotOptions,
): Promise<boolean> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return false
  try {
    // incoming
  } catch (e) {
    errors.raiseReply(e, message)
    return false
  }
  return false
}
