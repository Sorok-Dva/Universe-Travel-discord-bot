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
  muteLogged = false,
): Promise<void> => {
  const muteLogsChannel = '860216944351117342'
  const mainLogChanel = '760066896942202892'

  const logChannel = <TextChannel>Bot.client.channels.cache
    .find(c => c.id === mainLogChanel)
  await logChannel.send({ embed: <MessageEmbed>embed })

  if (muteLogged) {
    const staffChannel = <TextChannel>Bot.client.channels.cache
      .find(c => c.id === muteLogsChannel)
    await staffChannel.send({ embed: <MessageEmbed>embed })
  }
}
