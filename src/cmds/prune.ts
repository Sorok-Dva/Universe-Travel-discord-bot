/*******************************************************************************
 *  cmds/prune.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 1:17 PM
 *  |__   _|/ __/                          Updated: 2021/06/21 1:34 PM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { Client, Message, TextChannel } from 'discord.js'
import { BotOptions } from '@ustar_travel/discord-bot'
import { errors } from '../core'

exports.run = async (client: Client, message: Message, args: Array<string>, config: BotOptions) => {
  try {
    if (message.author.id !== config.botOwner
      && message.author.id !== config.serverOwner) return errors.raiseReply('Cette commande est réservée aux administrateurs.', message);
    let [num] = args
    let amount = parseInt(num) ?? 1
    const finalAmount = amount > 50 ? 50 : amount
    const channel = message.channel as TextChannel
    channel.bulkDelete(finalAmount).then(async () => {
      await channel
        .send(`*<@${message.author.id}>, ${finalAmount} messages ont été supprimés.*`)
        .then(msg => msg.delete({ timeout: 10000 }))
        .catch(err => errors.raiseReply(err, message));
    });
  } catch (e) {
    errors.raiseReply(e, message)
    return null
  }
}
