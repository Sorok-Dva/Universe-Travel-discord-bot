/** ***************************************************************************
 *  cmds/mute.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/26 1:13 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/01 3:45 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { env } from '@materya/carbon'
import {
  GuildMember,
  Message, MessageEmbed,
  Role,
  TextChannel,
} from 'discord.js'
import { Bot, errors } from '../core'
import { dbHelper, CommandAccess, logger } from '../helpers'
import { userFactory } from '../db/factories'

type Args = readonly string[]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    const [_u, timer, ...brutReason] = args
    const reason = brutReason.join(' ')
    const userId = <string>message.mentions.users.first()?.id
    if (!userId) {
      errors.raiseReply('Veuillez désigmer un utilisateur valide (@pseudo#000)', message)
      return
    }
    const mainChannel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === '760062418167922717')
    const userToMute = <GuildMember>mainChannel?.members
      .find(u => u.id === userId)

    if (userToMute) {
      await dbHelper.savingRolesBeforeMute(userToMute, timer, reason)
    }

    const embedStaff = new MessageEmbed()
      .setTitle(`@${userToMute.displayName} vient d'être mute`)
      .setColor('RED')
      .setDescription(`<@${message.author.id}> vient de rendre aphone <@${userToMute.id}> pour le motif suivant : \n\n **${reason}**\n
      et pour la durée suivante: **${timer}**`)
      .setFooter(message.author.username)
      .setTimestamp()

    // send a dm to the user to explains what to do know he's accepted
    Bot.client.users.fetch(userToMute.id, false)
      .then(u => {
        u.send(`🤐 **Oops, vous venez d'être mute**

        > Cela signifie que vous avez enfreins une des lois de la charte. Nous vous rappelons que nous aspirons à avoir une communauté adulte et soudée. Bienveillance et respect sont donc primordiales si vous voulez rester.

        > Vous avez été mute pour la raison suivante : **${reason}**

        _Nous espérons sincèrement que cette sanction vous fait prendre conscience du type de comportement que nous n'attendons pas sur **Universe Travel**_`)
      })

    // default logger in logs Channel
    await logger.event(embedStaff, true)
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'mute',
  desc: 'Permet de rendre aphone un membre et lui empêcher toute intéraction sur le serveur (réservé aux mod et +)',
  args: [],
  mandatoryArgs: true,
  usage: 'mute [utilisateur] [durée] [motif] ',
  examples: ['mute @utilisateur', 'mute @utilisateur 1h Langage Abusif', 'mute @utilisateur 24h Mauvaise Intention'],
  run,
}

export default command
