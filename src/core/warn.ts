/** ***************************************************************************
 *  warn.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/27 4:23 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/28 3:44 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { Message, MessageEmbed, User } from 'discord.js'

export default {
  /**
   * send a mode warmning to a specific user (save in userHistory)
   *
   * @function
   * */
  sendWarning: (
    user: User,
    message: Message,
    args: { reason: string; time: string },
  ): void => {
    return
    const embed = new MessageEmbed()
      .setTitle(`Avertissement pour <@${user.id}>`)
      .setColor(0xFF0000)
      .setDescription(`Tu as enffrein notre charte : ${args.reason}.\nTe voilà prévenu, la prochaine fois c'est une santion`)
      .setTimestamp()
      .setAuthor(user.id)

    message.reply({ embed }).then(m => m.delete({ timeout: 15000 }))
  },

  /**
   * And a serious alert when everything goes out of control.
   * Sending alert will temporary disabled chat where the command were tt=yped
   *
   * @function
   * */
  sendAlert: (
    user: User,
    message: Message,
    args: { reason: string; time: number},
  ): void => {
    const embed = new MessageEmbed()
      .setTitle(`ALERTE GÉNÉRAL. Puisque vous semblez hors de contrôle,  personne ne pourra plus discuter ici pendant ${args.time}`)
      .setColor(0xFF0000)
      .setTimestamp()
      .setAuthor(user.id)

    message.reply({ embed }).then(m => m.delete({ timeout: 15000 }))
  },
}
