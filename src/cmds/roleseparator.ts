/** ***************************************************************************
 *  cmds/roleseparator.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/04 10:13 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/04 10:45 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandEntity } from '@ustar_travel/discord-bot'
import {
  GuildMember,
  Message,
  MessageEmbed,
  Role,
  TextChannel,
  User,
} from 'discord.js'
import { Bot, errors } from '../core'
import { dbHelper, CommandAccess, logger } from '../helpers'
import { userFactory } from '../db/factories'

const putRolesSeparators = (member: GuildMember): void => {
  const separatorsRoles = [
    '861333528938545172', // Staff Separator
    '861333845378990110', // Voluntaries/recruits separator
    '861333842333138975', // Special User Role separator
    '861333838294810684', // Level Up Role Separator
    '861333396285554699', // Mute / Default role Separator
    '861333292379668532', // Projects separator (e.g stationers)
    '861333418867556442', // Notifs / Access role separators
  ]
  member?.roles.cache.map((r: Role) => {
    if (separatorsRoles.includes(r.id)) return r

    member.roles.add(r, `Added Role Separator <@${r}>`)
    return r
  })
}
type Args = readonly string[]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'mod', message)
  if (!accessAllowed) return
  try {
    const [_u] = args
    const user = <User>message.mentions.users.first()
    console.log(user)
    let upgraded = 0
    const mainChannel = <TextChannel>Bot.client.channels.cache
      .find(c => user.id === '760062418167922717')

    if (user) {
      // @todo define the good separators depending atual role

      const userToUpgrade = <GuildMember>mainChannel?.members
        .find(u => u.id === user.id)
      putRolesSeparators(userToUpgrade)
      dbHelper.userUpdate(message, userToUpgrade)
      upgraded += 1
      return
    } else {
      const members = mainChannel?.members
      members?.forEach((m => {
        putRolesSeparators(m)
        dbHelper.userUpdate(message, m)
        upgraded += 1
      }))
    }
    
    const embed = new MessageEmbed()
      .setTitle('Les roles separators ont été mis à jour.')
      .setColor('green')
      .setDescription(`Added Role Separator for ${upgraded} users`)
      .setFooter(message.author.username)
      .setTimestamp()

    // default logger in logs Channel
    await logger.event(embed, false)
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<string> = {
  title: 'roleseparator',
  desc: 'Permet de mettre les roles separator sur un membre si définis ou mets à jour tout le membre (mod et +)',
  mandatoryArgs: false,
  usage: 'roleseparator [utilisateur]',
  examples: ['roleseparator @utilisateur', 'roleseparator'],
  run,
}

export default command
