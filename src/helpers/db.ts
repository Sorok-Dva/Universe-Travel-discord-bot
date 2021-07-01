/** ***************************************************************************
 *  helpers/db.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/27 5:21 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/27 5:24 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { GuildMember, Message } from 'discord.js'
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
  member: GuildMember,
  reason: string,
): Promise<Entity<User>> => {
  const oldRanks: string[] = []
  member?.roles.cache.map(r => {
    const necessaryRemoveRole = [
      '859191061712601129', // Aspirant Voyageur
      '854813324377194496', // Voyageur Initié
      '854814002563776532', // Voyageur confirmé
      '854814002563776532', // Aspirant Membre
      '854813976450170941', // Aspirant Membre
      '859771743195496468', // Membre d'équipage
      '854816696811913267', // Membre Honorable
      '760062417932779529', // Parrain
      '760062417941692436', // Membre Honoré
    ]
    if (necessaryRemoveRole.includes(r.id)) {
      oldRanks.push(r.id)
      member.roles.remove(r, 'Mute Temporaire - Raison : Nécessite la suppresion de tous les roles pour être fonctionnel')
    }
    member.roles.add('854816691544653895', `Mute Temporaire - Raison : ${reason}`)
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
    roles: ['854816691544653895'],
    metadata: {
      oldRoles: oldRanks,
    },
  })
}
