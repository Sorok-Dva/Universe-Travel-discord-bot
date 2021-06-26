/** ***************************************************************************
 *  cmds/unmute.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/23 10:28 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/26 1:24 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { env } from '@materya/carbon'
import { Message } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly string[]

const run = (
  message: Message,
  args: Args,
): void => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    // incoming
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'mute',
  desc: 'Vous permet de rendre muet un utilisateur',
  args: [],
  mandatoryArgs: true,
  usage: 'mute [utilisateur] [durée]',
  examples: ['mute @utilisateur 1h', 'mute @utilisateur 7d'],
  run,
}

export default command
