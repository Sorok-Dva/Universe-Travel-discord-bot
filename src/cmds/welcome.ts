/** ***************************************************************************
 *  cmds/welcome.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/17/01 23:13 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/17/01 1:24 AM by Сорок два
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
import { CommandAccess, logger } from '../helpers'
import { userFactory } from '../db/factories'

type Args = readonly string[]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  if (message.channel.id !== '859840033539227668') {
    errors.raiseReply('Impossible d\'utiliser cette commande en dehors du salon <#859840033539227668>', message)
    return
  }
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    const [user, ...brutRemark] = args
    const remark = brutRemark.join(' ')

    const upgradeRole = <Role>message.guild?.roles.cache
      .get('859849160659042335')
    const removeRole = <Role>message.guild?.roles.cache
      .get('760062417932779523')
    const userId = <string>message.mentions.users.first()?.id
    if (!userId) {
      errors.raiseReply('Veuillez désigmer un utilisateur valide (@pseudo#000)', message)
      return
    }
    const waitingChannel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === '859840033539227668')
    const welcomedUser = <GuildMember>waitingChannel?.members
      .find(u => u.id === userId)

    if (welcomedUser?.roles.cache.has(removeRole?.id)) {
      welcomedUser.roles.remove(removeRole)
        .catch(error => errors.raiseReply(error, message))
      welcomedUser.roles.add(upgradeRole)
        .catch(error => errors.raiseReply(error, message))
      // Send message to general staff to invite them interact with the new user
      const embedStaff = new MessageEmbed()
        .setTitle(`Entretien terminé pour @${welcomedUser.displayName}`)
        .setColor('GREEN')
        .setDescription(`<a:megaphone:853041585385635850> @everyone: <@${message.author.id}> a passé l'entretien avec <@${welcomedUser.id}> qui **s'est visiblement bien passé** !
        ${remark ? `<@${message.author.id}> a laisser une note sur sur cet entretion : **${remark}**` : ''}
        **On compte sur vous pour intégrer <@${welcomedUser.id}> dans le tchat général !**
      `)
        .setTimestamp()
        .setAuthor(message.author.username)

      // Send a message into general tchat to try create activity between members
      const embedGeneral = new MessageEmbed()
        .setTitle(`Faites une standing ovation pour @${welcomedUser.displayName}`)
        .setColor('BLUE')
        .setDescription(`<a:megaphone:853041585385635850> @everyone: On accueuil chaleureusement <@${message.author.id}> qui vient de passer son entretient et que le staff vient de valider !
        **On compte sur vous pour l'aider à s'intégrer et à faire connaissance avec lui !**
      `)
        .setTimestamp()

      const general = '853762190010875934'
      const generaChannel = <TextChannel>Bot.client.channels.cache
        .find(c => c.id === general)
      await generaChannel.send({ embed: <MessageEmbed>embedGeneral })

      // send a dm to the user to explains what to do know he's accepted
      Bot.client.users.fetch(welcomedUser.id, false).then(u => {
        u.send(`<a:stockrocket:853042246974701608> **Bienvenue à toi ${welcomedUser.nickname} dans notre communauté de passionné(e)s d'astronomie et de sciences**

        > Tu as passé avec brio ton entretien et nous sommes très heureux de t'accueillir de notre communauté.

        > Maintenant que le staff t'as validait, il te reste quelques étapes avant d'avoir un accès total au serveur, il te suffit de prendre connaissance de la charte et de la signer via role-react et c'est tout !

        _Nous espérons sincèrement construire quelque chose de super avec vous, par le biais des events, des tutos, de débats, des news, ça va prendre un peu de temps avant que la machine se mette en route, mais si tu nous laisses une chance tu ne seras pas déçu_ :wink: :vulcan:'`)
      })

      // default logger in logs Channel
      await logger.event(embedStaff, true)
      // todo improve this
      const dbUserId = await userFactory.upsert({
        id: welcomedUser.id,
        nickname: welcomedUser.user.username,
      }, {
        uniqueConstraintColumnNames: ['id'],
      })
      await userFactory.update(dbUserId, {
        nickname: welcomedUser.user.username,
        roles: [upgradeRole.id],
      })
    } else {
      console.error('unable to use welcome command, the user doesn\'t have the default role')
    }
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'welcome',
  desc: 'Vous permet de donner le premier accès au serveur à un nouvel arrivant (réservé aux mod et +)',
  args: [],
  mandatoryArgs: true,
  usage: 'welcome [utilisateur] [remarque] ',
  examples: ['welcome @utilisateur', 'welcome @utilisateur Super enthousiate et très sympa'],
  run,
}

export default command
