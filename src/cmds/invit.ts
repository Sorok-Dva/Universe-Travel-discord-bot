/** ***************************************************************************
 *  cmds/invit.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 12:12 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/26 1:26 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { env } from '@materya/carbon'
import {
  GuildChannel,
  InviteOptions,
  Message,
} from 'discord.js'
import { errors } from '../core'

type Args = readonly number[]

const run = (
  message: Message,
  args: Args,
): void => {
  if (!message.guild) return
  const [age, use] = args
  const maxAge = (typeof parseInt(String(age), 10) === 'number')
    ? (age * 3600)
    : 3600
  const maxUse = (typeof parseInt(String(use), 10) === 'number') ? use : 10
  if (!Number.isNaN(age)
    && !Number.isNaN(use)
    && Number(age) <= 24
    && maxUse <= 100
    && Math.sign(Number(age)) === 1
    && Math.sign(Number(maxUse)) === 1) {
    const channel = message.guild.channels.cache.get(env.get('ARRIVAL_CHANNEL_ID')) as GuildChannel
    channel.createInvite({
      maxAge,
      maxUse,
    } as InviteOptions)
      .then(invite => message.reply(`voici une invitation valide pendant **${age}** heure(s) avec une limite de **${maxUse}** utilisations.\n\n ${invite.url}`)
        .catch(err => {
          errors.raiseReply(err, message)
        }))
  } else {
    errors.raiseCommand({
      command: 'invit',
      usage: 'invit [maxAge|number] [maxUse|number].',
      example: '`invit 24 100` (limité à 24 heures et 100 utilisations)',
    }, message)
  }
}

const command: CommandEntity<number> = {
  title: 'invit',
  desc: 'Vous permet de générer simplement une invitation temporaire',
  args: [],
  mandatoryArgs: true,
  usage: 'invit [maxAge] [maxUse]',
  examples: ['invit 24 1', 'invit 1 1'],
  run,
}

export default command
