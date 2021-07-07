/** ***************************************************************************
 *  helpers/db.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/27 5:21 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/27 5:24 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { GuildMember, Message, Role } from 'discord.js'
import { Entity, User } from '@ustar_travel/discord-bot'
import { userFactory } from '../db/factories'
import { userRepo } from '../db/repositories'
import { rolesHelper } from '.'

export const userUpdate = async (
  message: Message,
  member?: GuildMember,
): Promise<Entity<User>> => {
  const userRoles = (member || message.member)?.roles.cache.map(r => r.id)
  const dbUserId = await userFactory.upsert({
    id: message.author.id,
    nickname: message.author.username,
  }, {
    uniqueConstraintColumnNames: ['id'],
  })
  const user = await userRepo.one({
    filters: {
      id: dbUserId,
    },
  })

  // envoyer log dans un chan special mode
  // envoyer notif dans chan mod pour éviter la double sanction
  const finalUser = await userFactory.update(dbUserId, {
    nickname: message.author.username,
    roles: userRoles,
    message_count: user.message_count += 1,
  })

  // Double-Security for the mute system
  if (finalUser.muted) await message.delete({ reason: 'muted' })

  return finalUser
}

export const savingRolesBeforeMute = async (
  member: GuildMember,
  timer: string,
  reason: string,
): Promise<Entity<User>> => {
  const oldRanks: string[] = []
  const necessaryRemoveRole = [
    ...rolesHelper.levelUpRoles,
    ...rolesHelper.specialUserRole,
    ...rolesHelper.volunteersRole,
    ...rolesHelper.basicRole.filter(r => r !== env.get('MUTE_ROLE')),
  ]
  member?.roles.cache.map(r => {
    if (necessaryRemoveRole.includes(r.id)) {
      oldRanks.push(r.id)
      member.roles.remove(r, 'Mute, nécessite la suppresion de tous les roles pour être fonctionnel')
    }
    member.roles.add(env.get('MUTE_ROLE'), `Mute Temporaire de ${timer} - Raison : ${reason}`)
    return r
  })

  const dbUserId = await userFactory.upsert({
    id: member.id,
    nickname: member.user.username,
  }, {
    uniqueConstraintColumnNames: ['id'],
  })

  return userFactory.update(dbUserId, {
    nickname: member.user.username,
    roles: [env.get('MUTE_ROLE')],
    muted: true,
    metadata: {
      oldRoles: oldRanks,
      sanctions: {
        mute: {
          date: new Date(),
          reason,
          timer,
          unmute: null,
          unmuteReason: null,
        },
      },
    },
  })
}

export const reinstituteRoleAfterUnmute = async (
  member: GuildMember,
  reason: string,
  message: Message,
): Promise<Entity<User> | null> => {
  const mutedRole = <Role>message.guild?.roles.cache
    .get(env.get('MUTE_ROLE'))
  if (member?.roles.cache.has(mutedRole?.id)) {
    const dbUserId = await userFactory.upsert({
      id: member.id,
      nickname: member.user.username,
    }, {
      uniqueConstraintColumnNames: ['id'],
    })
    const { oldRoles } = (await userRepo.one({
      filters: {
        id: dbUserId,
      },
      fields: ['metadata'],
    })).metadata

    await member.roles.remove(env.get('MUTE_ROLE'), `Fin du mute pour la raison ${reason}`)
    const unmuteReason = `Fin du mute. ${reason ? `(ou raccourcit pour le motif : ${reason})` : ''}`

    oldRoles?.map(r => member.roles.add(r, unmuteReason))

    return userFactory.update(dbUserId, {
      nickname: member.user.username,
      roles: <string[]>oldRoles,
      muted: false,
      metadata: {
        oldRoles,
      },
    })
  }
  return null
}
