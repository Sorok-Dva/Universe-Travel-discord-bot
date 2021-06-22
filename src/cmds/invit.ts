/*******************************************************************************
 *  cmds/invit.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 12:12 AM
 *  |__   _|/ __/                          Updated: 2021/06/22 1:31 AM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { env } from '@materya/carbon';
import { Client, GuildChannel, InviteOptions, Message } from 'discord.js';
import { errors } from '../core'

exports.run = (client: Client, message: Message, args: Array<number|string>) => {
  if (!message.guild) return false
  let [age, use] = args
  let maxAge = (typeof parseInt(String(age)) === 'number') ? (Number(age) * 3600) : 3600
  let maxUse = (typeof parseInt(String(use)) === 'number') ? use : 10
  if (!isNaN(age as number)
    && !isNaN(use as number)
    && Number(age) <= 24
    && maxUse <= 100
    && Math.sign(Number(age)) === 1
    && Math.sign(Number(maxUse)) === 1) {
    const channel = message.guild.channels.cache.get(env.get('ARRIVAL_CHANNEL_ID')) as GuildChannel
    channel.createInvite({maxAge, maxUse} as InviteOptions).then(invite =>
      message.reply(`voici une invitation valide pendant **${age}** heure(s) avec une limite de **${maxUse}** utilisations.\n\n ${invite.url}`)
        .catch(err => {
          errors.raiseReply(err, message)
        }),
    )
  } else {
    errors.raiseCommand({
      command: 'invit',
      trueCommand: '!invit [maxAge|number] [maxUse|number].',
      example: '`!invit 1 100` (limité à 24 heures et 100 utilisations)',
    }, message)
  }
}
