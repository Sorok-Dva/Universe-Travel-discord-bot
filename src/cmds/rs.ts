/** ***************************************************************************
 *  cmds/rs.ts (roleseparator)
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/04 10:13 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/06 2:27 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import now from 'performance-now'
import { CommandEntity } from '@ustar_travel/discord-bot'
import {
  Collection,
  GuildMember, GuildMemberManager,
  Message,
  MessageEmbed,
  TextChannel,
  User,
} from 'discord.js'
import { Bot, errors } from '../core'
import {
  dbHelper,
  CommandAccess,
  logger,
  rolesHelper,
} from '../helpers'

const putRolesSeparators = async (member: GuildMember): Promise<void> => {
  rolesHelper.separatorsRoles.forEach((r: string, i) => {
    const userRoles = member?.roles.cache.map(mr => mr.id)
    const havesSeparator = userRoles.filter(sr => sr !== r)
    if (havesSeparator.length < 1) return

    let needSeparator = false

    switch (i) {
      case 0: // Staff
        if (rolesHelper.staffRole.some(role => userRoles.indexOf(role) >= 0)) {
          needSeparator = true
        } break
      case 1: // volunteers
        if (rolesHelper.volunteersRole.some(role => userRoles
          .indexOf(role) >= 0)) {
          needSeparator = true
        } break
      case 2: // special users
        if (rolesHelper.specialUserRole.some(role => userRoles
          .indexOf(role) >= 0)) {
          needSeparator = true
        } break
      case 3: // notifs
        if (rolesHelper.levelUpRoles.some(role => userRoles
          .indexOf(role) >= 0)) {
          needSeparator = true
        }
        break
      case 4: // access
        if (rolesHelper.notifsRoles.some(role => userRoles
          .indexOf(role) >= 0)) {
          needSeparator = true
        } break
      case 5: // levelup
        if (rolesHelper.accessRoles.some(role => userRoles
          .indexOf(role) >= 0)) {
          needSeparator = true
        } break
      case 6: // basic
        if (rolesHelper.basicRole.some(role => userRoles
          .indexOf(role) >= 0)) {
          needSeparator = true
        } break
      default: return
    }

    if (needSeparator) member.roles.add(r, `Added Role Separator <@&${r}>`)
  })
}

const run = async (
  message: Message,
): Promise<void> => {
  const startTime = now()
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    const user = <User>message.mentions.users.first()
    let upgraded = 0
    const mainChannel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === '760062418167922717')

    if (user) {
      const userToUpgrade = <GuildMember>mainChannel?.members
        .find(u => u.id === user.id)
      await putRolesSeparators(userToUpgrade)
      await dbHelper.userUpdate(message, userToUpgrade)
      upgraded += 1
      const endTime = now()
      const execTime = `${(endTime - startTime).toFixed(3)} ms`

      const embed = new MessageEmbed()
        .setTitle(`Les roles separators ont été mis à jour pour ${user.username}`)
        .setColor('green')
        .setDescription('Role séparateurs ajoutés avec succès')
        .setFooter(`${message.author.username}, executed in ${execTime}`)
        .setTimestamp()

      await message.channel.send({ embed })
      return
    }

    const usersToUpgrade = mainChannel?.members.filter(u => u.roles.cache.get('854816691544653895') !== null)
    console.log(usersToUpgrade)
    await Promise.all(usersToUpgrade?.map(async m => {
      console.log('updating separator role of ', m.user.id, m.user.username)
      await putRolesSeparators(m)
      upgraded += 1
    }))

    const endTime = now()
    const execTime = `${(endTime - startTime).toFixed(3)} ms`

    const embed = new MessageEmbed()
      .setTitle(`Les roles separators ont été mis à jour.\n_(${usersToUpgrade?.map(async m => `<@${m.user.id}>`).join(', ')})_`)
      .setColor('green')
      .setDescription(`Added Role Separator for ${upgraded} users`)
      .setFooter(`${message.author.username}, executed in ${execTime}`)
      .setTimestamp()

    await message.channel.send({ embed })
    await logger.event(embed, false)
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'rs',
  desc: 'Permet de mettre les roles separator sur un membre si définis ou mets à jour tout le membre (mod et +)',
  mandatoryArgs: false,
  usage: 'rs [utilisateur]',
  examples: ['rs @utilisateur', 'rs'],
  run,
}

export default command

export { putRolesSeparators }
