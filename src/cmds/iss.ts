/** ***************************************************************************
 *  cmds/iss.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/26 1:10 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/26 1:12 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { env } from '@materya/carbon'
import { Message } from 'discord.js'
import { errors } from '../core'

type Args = readonly string[]

const run = (
  message: Message,
  args: Args,
): void => {
  // todo
}

const command: CommandEntity<string> = {
  title: 'iss',
  desc: 'Vous permet de récupérer différentes informations à propos de l\'ISS',
  args: [],
  mandatoryArgs: false,
  usage: '',
  examples: [],
  run,
}

export default command
