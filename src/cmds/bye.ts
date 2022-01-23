/** ***************************************************************************
 *  cmds/bye.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/26 1:13 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/26 2:49 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { env } from '@materya/carbon'
import {
  GuildMember,
  Message, MessageEmbed,
  MessageMentions,
  Role,
  TextChannel,
} from 'discord.js'
import { time } from 'cron'
import { Bot, errors } from '../core'
import { CommandAccess, dbHelper, logger } from '../helpers'
import { userFactory } from '../db/factories'

type Args = readonly string[]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  if (message.channel.id !== '859840033539227668') return
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    const [user, ...brutRemark] = args
    const remark = brutRemark.join(' ')

    const userId = <string>message.mentions.users.first()?.id
    if (!userId) {
      errors.raiseReply('Veuillez désigner un utilisateur valide (@pseudo#000)', message)
      return
    }

    Bot.client.users.fetch(userId, false)
      .then(u => {
        u.send(`:pensive:**Nous sommes désolés**

          > Tu ne sembles pas correspondre aux critères du serveur, suite à ton entretien nous avons jugé que soit ce type de serveur n'est pas ce que tu recherches, soit que tu ne t'épanouiras pas comme tu le souhaites.
          
          > Cependant, si la raison de ton refus n'était pas ton âge _(serveur limité à 15 ans min)_ et que tu penses que nous avons mal pris notre décision, tu es libre de redemander un entretien lorsque tu le souhaites, quand tu te sentiras prêt !
          
          D'ici là, à la revoyure, en espérant que tu ne te perdes pas dans l'abyme du cosmos :milky_way:
          
          ${env.get('DISCORD_INVITATION')}
      `)
      }).catch(error => errors.log(error))

    const channel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === '859840033539227668')
    const refusedUser = <GuildMember>channel?.members
      .find(u => u.id === userId)

    const embedStaff = new MessageEmbed()
      .setTitle(`Entretien terminé pour @${refusedUser.user}`)
      .setColor('RED')
      .setDescription(`<:spaceHole:853042246382518282> <@${message.author.id}> a passé l'entretien avec <@${refusedUser.id}> qui **s'est visiblement mal passé ou pas comme prévu 😢**.
        ${remark ? `<@${message.author.id}> a laisser une note sur cet entretion : **${remark}**` : ''}
        
        **On lui laisse l'occasion de ressayer dans un peu plus de temps !**
      `)
      .setTimestamp()
      .setAuthor(message.author.username)
    await logger.event(embedStaff)
    if (!refusedUser.kickable) {
      errors.raiseReply('Veuillez désigmer un utilisateur valide (@pseudo#000)', message)
    }

    refusedUser.kick(`Profil non adapté à la communauté : ${remark} ? ${remark} : ''`)
      .catch(err => errors.raiseReply(err, message))
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'bye',
  desc: 'Vous permet d\'expulser un membre du serveur qui n\'a pas mener à bien l\'entretien (réservé aux mod et +)',
  args: [],
  mandatoryArgs: true,
  usage: 'bye [utilisateur] [raison] ',
  examples: ['bye @utilisateur', 'bye @utilisateur Troll', 'bye @utilisateur Pas intéressé du tout par le serveur'],
  run,
}

export default command
