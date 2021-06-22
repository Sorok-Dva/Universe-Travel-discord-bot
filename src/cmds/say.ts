/** *****************************************************************************
 *  cmds/say.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 12:08 AM
 *  |__   _|/ __/                          Updated: 2021/06/22 11:53 PM
 *     |_| |_____|U*Travel
 /***************************************************************************** */
import { Message } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

exports.run = (message: Message, args: Array<string>): void => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'dev', message)
  if (!accessAllowed) return

  message.channel.send(args.join(' '))
    .catch(err => errors.raiseReply(err, message))
}
