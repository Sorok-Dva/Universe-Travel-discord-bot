/** ***************************************************************************
 *  modules/nasa.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/01/23 11:08 PM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/21 12:27 AM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { MessageEmbed, User } from 'discord.js'
import { google, nasa } from '../connectors'
import { OneRecordAnswer } from '../connectors/nasa/apod'

/**
 * @function apod
 *
 * @description Retrieve the daily photo of the nasa
 *  */
const apod = async (opts?: {
  date?: Date
  count?: number
  author?: User
  notif?: boolean
}): Promise<MessageEmbed | Array<MessageEmbed> | undefined> => {
  const maxUse = 50
  let use = 0

  if (use === maxUse) {
    console.error(`[Google Translate] Max request allowed for today (${maxUse}`)
    return
  }

  const data = await nasa.apod.get(opts)
  const askedBy = opts?.author ? `・par ${opts.author.username}` : ''

  if (!opts?.count) {
    const record = <OneRecordAnswer>data
    const tr = (await google
      .translate({
        text: [record.title, record.explanation],
        target: 'fr',
      }))[0]
    use += 1
    const [title, desc] = tr
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle(title)
      .setDescription(`${opts?.notif ? '<@&853036396205834261>, ' : ''}${desc}`)

    if (record.media_type === 'video') {
      embed.addField('<:YouTube:854824522069573662>・Vidéo', record.url)
      embed.setURL(record.url)
    } else {
      embed.setImage(record.hdurl)
    }

    embed.addField('(c)', `_${record.copyright ?? 'Inconnu'}_`, true)
      .addField('Date', `_${record.date}_`, true)
      .setFooter(`Via l'api de la NASA・Traduit avec Google Traduction${askedBy}`)
      .setTimestamp()

    // eslint-disable-next-line consistent-return
    return embed
  }

  const records = <Array<OneRecordAnswer>> data

  const embeds: Array<MessageEmbed> = await Promise.all(
    records.map(async record => {
      const tr = (await google
        .translate({
          text: [record.title, record.explanation],
          target: 'fr',
        }))[0]
      use += 1
      const [title, desc] = tr
      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(title)
        .setDescription(`${opts?.notif ? '<@&853036396205834261>, ' : ''}${desc}`)

      if (record.media_type === 'video') {
        embed.addField('<:YouTube:854824522069573662> vidéo', record.url)
        embed.setURL(record.url)
      } else {
        embed.setImage(record.hdurl)
      }

      embed.addField('(c)', `_${record.copyright ?? 'Inconnu'}_`, true)
        .addField('Date', `_${record.date}_`, true)
        .setFooter(`Via l'api de la NASA et traduit avec Google Traduction. ${askedBy}`)
        .setTimestamp()

      return embed
    }),
  )

  // eslint-disable-next-line consistent-return
  return embeds
}

export {
  // eslint-disable-next-line import/prefer-default-export
  apod,
}
