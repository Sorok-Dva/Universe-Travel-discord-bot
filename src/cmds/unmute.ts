/** ***************************************************************************
 *  cmds/mute.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/26 1:13 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/01 3:45 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandEntity, PrimaryKey } from '@ustar_travel/discord-bot'
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
import { userRepo } from '../db/repositories'
import { reinstituteRoleAfterUnmute } from '../helpers/db'

type Args = readonly string[]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    const [user, ...brutReason] = args
    const reason = brutReason.join(' ')
    const userId = <string>message.mentions.users.first()?.id
    if (!userId) {
      errors.raiseReply('Veuillez désigmer un utilisateur valide (@pseudo#000)', message)
      return
    }
    const mainChannel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === '760062418167922717')
    const userToUnmute = <GuildMember>mainChannel?.members
      .find(u => u.id === userId)

    if (userToUnmute) {
      await dbHelper.reinstituteRoleAfterUnmute(userToUnmute, reason, message)
    }

    const embedStaff = new MessageEmbed()
      .setTitle(`Unmute de @${userToUnmute.displayName}`)
      .setColor('DARK_GREEN')
      .setDescription(`<@${message.author.id}> vient de de lever le mute sur <@${userToUnmute.id}> ${reason ? `pour le motif suivant **${reason}**` : ''}`)
      .setTimestamp()
      .setAuthor(message.author.username)

    // send a dm to the user to explains what to do know he's accepted
    Bot.client.users.fetch(userToUnmute.id, false)
      .then(u => {
        u.send(`<a:stockrocket:853042246974701608> **Votre mute vient d'être levé**

        > Soyez plus vigileant et évitez qu'un tel comportement ne se reproduise !

        _Nous espérons sincèrement que cette sanction te fera prendre conscience du type de comportement que nous n'attedons pas sur **U*Travel**_`)
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
