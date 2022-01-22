/** ***************************************************************************
 *  wan.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/28 3:14 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/28 3:14 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { Message, User } from 'discord.js'
import { CommandEntity } from '@ustar_travel/discord-bot'
import { CommandAccess } from '../helpers'
import { errors } from '../core'
import warn from '../core/warn'

type Args = readonly string[]
const run = (
  message: Message,
  args: Args,
): void => {
  try {
    const [user, reason, time] = args
    console.log([user, reason, time])
    const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
    if (!accessAllowed) return
    warn.sendWarning(<User>message.member?.user, message, { reason, time })
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

// todo: fix this never that I forced here only to compile
const command: CommandEntity<never> = {
  title: 'warn',
  desc: 'Vous permet d\'avertir un utilisteur dont le comportement deviendrait problèmatique',
  args: [],
  mandatoryArgs: true,
  usage: 'warn [utilisateur] [raison]',
  examples: ['warn @utilisateur Spam', 'warn @utilisateur Insultes'],
  run,
}

export default command
