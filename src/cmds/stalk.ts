/** ***************************************************************************
 *  cmds/say.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/03/28 9:41 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/03/28 9:52 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[]

const run = (message: Message, args: Args): void => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  
  const [user, until, reason] = args
  console.log(user, until, reason)
}

const command: CommandEntity<string> = {
  title: 'stalk',
  desc: 'Mettre un membre sous surveillance.',
  args: [],
  mandatoryArgs: true,
  usage: 'stalk [utilisateur] [date de fin] [raison]',
  examples: ['stalk Сорок два#0042 25/02/2023 Tiens des propos borderlines...'],
  run,
}

export default command

