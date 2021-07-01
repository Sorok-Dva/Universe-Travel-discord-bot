/** ***************************************************************************
 *  helpers/db.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/27 5:21 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/27 5:24 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { Message } from 'discord.js'
import { Entity, User } from '@ustar_travel/discord-bot'
import { userFactory } from '../db/factories'
import { userRepo } from '../db/repositories'

// eslint-disable-next-line import/prefer-default-export
export const userUpdate = async (
  message: Message,
): Promise<Entity<User>> => {
  const userRoles = message.member?.roles.cache.map(r => r.id)
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
  console.log(finalUser)
  return finalUser
}

export const savingRolesBeforeMute = async (
  message: Message,
): Promise<Entity<User>> => {
  const userRoles = message.member?.roles.cache.map(r => (
    r.delete('Mute Temporaire - Pour que le mute soit efficace aucun autre rôle ne doit être actif avec des permissions plus élévées (peu importe la hierahie sur discord')
  ))
  const dbUserId = await userFactory.upsert({
    id: message.author.id,
    nickname: message.author.username,
  }, {
    uniqueConstraintColumnNames: ['id'],
  })
  return userFactory.update(dbUserId, {
    nickname: message.author.username,
    roles: ['854816691544653895'],
    metadata: {
      oldRoles: userRoles,
    },
  })
}
