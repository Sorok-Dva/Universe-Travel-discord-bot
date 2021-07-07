/** ***************************************************************************
 *  cmds/reload.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/21 1:45 PMby Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:25 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity, CommandName } from '@ustar_travel/discord-bot'
import { Message } from 'discord.js'
import { errors } from '../core'
import { CommandAccess } from '../helpers'

type Args = readonly [CommandName][]

const run = async (
  message: Message,
  args: Args,
): Promise<void> => {
  const accessAllowed = CommandAccess.checkPermission(message.author, 'dev', message)
  if (!accessAllowed) return

  try {
    // check ts-node module, should have api, call compiler and recompile
    delete require.cache[require.resolve(`/build/dist/cmds/${args[0]}.js`)]
    await message
      .reply(`la commande \`${args[0]}\` a été rechargée.`)
      .then(msg => msg.delete({ timeout: 5000 }))
      .catch(err => errors.raiseReply(err, message))
  } catch (error) {
    errors.raiseReply(error, message)
  }
}

const command: CommandEntity<[CommandName]> = {
  title: 'reload',
  desc: 'Permet de recharger une commande (réservé aux admins)',
  args: [], // define runtime cmds list
  mandatoryArgs: true,
  usage: 'reload [command].',
  examples: ['`reload invit` (limité aux administrateurs)'],
  run,
}

export default command
