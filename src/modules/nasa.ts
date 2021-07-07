import { MessageEmbed, User } from 'discord.js'
import { nasa } from '../connectors'
import { translateHelper } from '../helpers'
import { OneRecordAnswer } from '../connectors/nasa/apod'

const apod = async (opts?: {
  date?: Date
  count?: number
  author?: User
  notif?: boolean
}): Promise<MessageEmbed | Array<MessageEmbed> | undefined> => {
  const data = await nasa.apod.get(opts)
  console.log(data)
  const askedBy = opts?.author ? `・par ${opts.author.username}` : ''

  if (!opts?.count) {
    const record = <OneRecordAnswer>data
    const tr = (await translateHelper
      .translate([record.title, record.explanation], 'fr'))
      .translations

    const [title, desc] = tr.map((t: { text: string }) => t.text)
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
      .setFooter(`Via l'api de la NASA・Traduit avec Yandex${askedBy}`)
      .setTimestamp()

    return embed
  }

  const records = <Array<OneRecordAnswer>> data
  console.log(records)

  const embeds: Array<MessageEmbed> = await Promise.all(
    records.map(async record => {
      const trans = (await translateHelper
        .translate([record.title, record.explanation], 'fr'))
        .translations
      const [title, desc] = trans.map(t => t.text)

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
        .setFooter(`Via l'api de la NASA et traduit avec Yandex. ${askedBy}`)
        .setTimestamp()

      return embed
    }),
  )

  return embeds
}

const imageSearch = async (opts?: {
  date?: Date
  count?: number
  author?: User
  notif?: boolean
}): Promise<MessageEmbed> => {
  const data = <OneRecordAnswer> await nasa.apod.get()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [title, desc] = ((await translateHelper
    .translate([data.title, data.explanation], 'fr')))

  return new MessageEmbed()
    .setColor('RANDOM')
    .setTitle(title.text)
    .setDescription(`<@&853036396205834261>, ${desc.text}`)
    .setImage(data.hdurl)
    .addField('Copyright', data.copyright, true)
    .addField('Date:', data.date, true)
    .setFooter('Récupérée via l\'api de la NASA et traduit avec Yandex')
    .setTimestamp()
}

export {
  apod,
  imageSearch,
}
