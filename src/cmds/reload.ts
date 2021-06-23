/** ***************************************************************************
 *  cmds/reload.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 1:45 PMby Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:25 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { Message } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

exports.run = async (
  message: Message,
  args: Array<string>,
): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'dev', message)
  if (!accessAllowed) return

  if (!args || args.length < 1) {
    errors.raiseCommand({
      command: 'reload',
      trueCommand: '!reload [command|string].',
      example: '`!reload invit` (limité aux administrateurs)',
    }, message)
    return
  }

  try {
    delete require.cache[require.resolve(`/build/dist/cmds/${args[0]}.js`)]
    await message
      .reply(`la commande \`${args[0]}\` a été rechargée.`)
      .then(msg => msg.delete({ timeout: 5000 }))
      .catch(err => errors.raiseReply(err, message))
  } catch (error) {
    errors.raiseReply(error, message)
  }
}
