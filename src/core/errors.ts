/** ***************************************************************************
 *  core/errors.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 12:07 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:28 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { Message, MessageEmbed } from 'discord.js'
import { CommandError } from '@ustar_travel/discord-bot'

export default {

  /**
   * raiseReply is use to reply an embed error to a user message
   *
   * @function
   *
   * @returns void
   * */
  raiseReply: (error: string, message: Message): void => {
    const embed = new MessageEmbed()
      .setTitle('Error')
      .setColor(0xFF0000)
      .setDescription(`An error has occurred : ${error}`)
      .setTimestamp()

    message.reply({ embed }).then(m => m.delete({ timeout: 15000 }))
  },

  /**
   * raiseCommand is trigger when a command doesn't habe expected arguments, it shows the example of usage
   *
   * @function
   *
   * @returns void
   * */
  raiseCommand: (error: CommandError, message: Message): void => {
    const embed = new MessageEmbed()
      .setTitle(`Error using the command \`!${error.command}\``)
      .setColor(0xFF0000)
      .addField('Utilisation', `\`${error.trueCommand}\`\n\n`)
      .addField('Example of use :', error.example)
      .setTimestamp()

    message.reply({ embed }).then(m => m.delete({ timeout: 15000 }))
  },

  /**
   * raise error outside bot interface, it will print a console.error into terminal
   *
   * @param error - Self-explanatory
   *
   * @returns void
   */
  raise: (error: Error): void => console.error(error),
}
