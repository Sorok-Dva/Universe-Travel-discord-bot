/** ***************************************************************************
 *  commandAccess.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/23 10:32 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/25 8:45 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { env } from '@materya/carbon'
import { Message, User } from 'discord.js'
import { errors } from '../core'

export type CommandRole = 'dev' |'owner' | 'admin' | 'mod'

export const allowedRolesText = {
  dev: 'au développeur du bot',
  owner: 'au propriétaire du server',
  admin: 'aux administrateurs',
  mod: 'aux modérateurs',
  vol: 'aux volontaires (rédacteurs, médiateurs, animateurs etd)',
}

export const checkPermission = (
  user: User,
  role: CommandRole,
  message: Message,
): boolean => {
  const serverOwner = env.get('SERVER_OWNER')
  const botOwner = env.get('BOT_OWNER')
  const adminRoles = env.get('ADMIN_ROLES')
  const modsRole = env.get('MOD_ROLES')

  let allowed = false

  if (user.id === serverOwner || user.id === botOwner) allowed = true // server and bot owner haves full permissions
  if (adminRoles.includes(user.id)) allowed = true // users designated as admins role can bypass this check
  if (role === 'mod' && modsRole.includes(user.id)) allowed = true // @todo doubt about this 🧐

  if (!allowed) errors.raiseReply(`Cette commande est réservée ${allowedRolesText[role]}.`, message)

  // 💡 maybe log when use try restricted commands
  return allowed
}
