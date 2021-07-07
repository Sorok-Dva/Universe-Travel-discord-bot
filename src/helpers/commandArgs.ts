/** ***************************************************************************
 *  commandArgs.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/25 8:02 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/25 8:58 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message } from 'discord.js'
import { Bot, errors } from '../core'

// eslint-disable-next-line import/prefer-default-export
export const validate = (
  args: Array<string>,
  command: CommandEntity<unknown>,
  message: Message,
): boolean => {
  const isMandatory = command.mandatoryArgs
  const allowedArgs = command.args ? [...command.args] : null
  let raiseError = false

  if (allowedArgs === null) return true
  // dynamic args trick, should find a better design
  if (isMandatory && allowedArgs.length === 0) allowedArgs.push('')

  const badArgs = args.filter(arg => (
    (allowedArgs.length === 1
      && allowedArgs[0] === ''
    ) ? false : !allowedArgs.includes(arg)
  ))

  if (isMandatory
    && allowedArgs.length > 0
    && args.length === 0) raiseError = true

  if (badArgs.length > 0) raiseError = true

  if (raiseError) {
    errors.raiseCommand({
      command: command.title,
      usage: command.usage,
      example: command.examples.map(c => `${Bot.prefix}${c}`).join(',\n'),
    }, message)

    return false
  }

  return true
}
