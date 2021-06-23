/** ***************************************************************************
 *  cmds/ping.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 12:13 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:23 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import now from 'performance-now'

import { Message } from 'discord.js'
import { errors } from '../core'

exports.run = async (message: Message): Promise<void> => {
  const startTime = now()
  message.channel.send('Oh ? Dear, dare you ping me ?')
    .then(answer => {
      const endTime = now()
      answer
        .edit(`Voici mon temps de réaction : \`${(endTime - startTime).toFixed(3)} ms\`.`)
        .then(msg => msg.delete({ timeout: 10000 }))
        .catch(err => errors.raiseReply(err, message))
    })
    .catch(err => errors.raiseReply(err, message))
}
