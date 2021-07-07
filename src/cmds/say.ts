/*******************************************************************************
 *  cmds/say.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 12:08 AM
 *  |__   _|/ __/                          Updated: 2021/06/21 12:11 AM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { Client, Message } from 'discord.js'
import { errors } from '../core'

exports.run = (client: Client, message: Message, args: Array<string>) => {
  message.channel.send(args.join(' '))
    .catch(err => errors.raiseReply(err, message))
};
