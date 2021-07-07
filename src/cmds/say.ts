/** ***************************************************************************
 *  cmds/say.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 12:08 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/26 1:24 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[]

const run = (message: Message, args: Args): void => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'dev', message)
  if (!accessAllowed) return

  message.channel.send(args.join(' '))
    .catch(err => errors.raiseReply(err, message))
}

const command: CommandEntity<string> = {
  title: 'say',
  desc: 'Parlez à la place du bot !',
  args: [],
  mandatoryArgs: true,
  usage: 'say [message]',
  examples: ['say Je suis en vie !'],
  run,
}

export default command
