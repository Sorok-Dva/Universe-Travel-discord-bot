/** ***************************************************************************
 *  helpers/db.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/07/01 12:55 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/07/01 01:54 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import {
  MessageEmbed,
  TextChannel,
} from 'discord.js'
import { Bot } from '../core'

// eslint-disable-next-line import/prefer-default-export
export const event = async (
  embed: MessageEmbed | string,
  chanStaff = false,
): Promise<void> => {
  const chanStaffId = '760062418763776041'
  const logChanel = '760066896942202892'

  const logChannel = <TextChannel>Bot.client.channels.cache
    .find(c => c.id === logChanel)
  await logChannel.send({ embed: <MessageEmbed>embed })

  if (chanStaff) {
    const staffChannel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === chanStaffId)
    await staffChannel.send({ embed: <MessageEmbed>embed })
  }
}
