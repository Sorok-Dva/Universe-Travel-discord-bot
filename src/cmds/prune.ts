/** ***************************************************************************
 *  cmds/prune.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 1:17 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/26 1:27 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, TextChannel } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly number[]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'admin', message)
  if (!accessAllowed) return

  try {
    const [num] = args
    const amount = Number.parseInt(String(num), 10) ?? 1
    const finalAmount = amount > 50 ? 50 : amount
    const channel = <TextChannel>message.channel
    channel.bulkDelete(finalAmount).then(async () => {
      await channel
        .send(`*<@${message.author.id}>, ${finalAmount} messages ont été supprimés.*`)
        .then(msg => msg.delete({ timeout: 10000 }))
        .catch(err => errors.log(err))
    })
  } catch (e) {
    errors.raiseReply(e, message)
  }
}

const command: CommandEntity<number> = {
  title: 'prune',
  desc: 'Permet de supprimer des messages (réservé aux admins)',
  args: [],
  mandatoryArgs: true,
  usage: 'prune [number]',
  examples: ['prune 5'],
  run,
}

export default command
