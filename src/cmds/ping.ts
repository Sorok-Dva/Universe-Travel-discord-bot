/*******************************************************************************
 *  cmds/ping.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 12:13 AM
 *  |__   _|/ __/                          Updated: 2021/06/21 12:17 AM
 *     |_| |_____|U*Travel
 /******************************************************************************/
import { Client, Message } from 'discord.js'
import now from 'performance-now'
import { errors } from '../core'

exports.run = async (client: Client, message: Message) => {
  let startTime = now()
  message.channel.send('Oh ? Dare you ping me ?').then(message => {
    let endTime = now()
    message
      .edit(`Well, ping took \`${(endTime - startTime).toFixed(3)} ms\`. I think.`)
      .then(msg => msg.delete({ timeout: 10000 }))
      .catch(err => errors.raiseReply(err, message))
  }).catch(err => errors.raiseReply(err, message))
}
