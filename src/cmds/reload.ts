/*******************************************************************************
 *  cmds/reload.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 1:45 PM
 *  |__   _|/ __/                          Updated: 2021/06/21 7:17 PM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { Client, Message } from 'discord.js';
import { BotOptions } from '@ustar_travel/discord-bot';
import { errors } from '../core'

exports.run = async (client: Client, message: Message, args: Array<string>, config: BotOptions) => {
  if (message.author.id !== config.botOwner
    && message.author.id !== config.serverOwner) return errors.raiseReply('Cette commande est réservée aux administrateurs.', message);

  if (!args || args.length < 1) return errors.raiseCommand({
    command: 'reload',
    trueCommand: '!reload [command|string].',
    example: '`!reload invit` (limité aux administrateurs)'
  }, message);

  try {
    delete require.cache[require.resolve(`/build/dist/cmds/${args[0]}.js`)];
    await message
      .reply(`la commande \`${args[0]}\` a été rechargée.`)
      .then(msg => msg.delete({timeout: 5000}))
      .catch(err => errors.raiseReply(err, message))
  } catch (error) {
    return errors.raiseReply(error, message)
  }
};
