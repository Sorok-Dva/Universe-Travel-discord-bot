import { MessageEmbed } from 'discord.js'
import { nasa } from '../connectors'
import { translateHelper } from '../helpers'

const apod = async (): Promise<MessageEmbed> => {
  const data = await nasa.apod.get()

  const [title, desc] = ((await translateHelper
    .translate([data.title, data.explanation], 'fr'))).translations

  return new MessageEmbed()
    .setColor('RANDOM')
    .setTitle(title.text)
    .setDescription(`<@&853036396205834261>, ${desc.text}`)
    .setImage(data.hdurl)
    .addField('Copyright', `_${data.copyright}_`, true)
    .addField('Date:', data.date, true)
    .setFooter('Récupérée via l\'api de la NASA et traduit avec Yandex')
    .setTimestamp()
}

const imageSearch = async (): Promise<MessageEmbed> => {
  const data = await nasa.apod.get()

  const [title, desc] = ((await translateHelper
    .translate([data.title, data.explanation], 'fr'))).translations

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

const apodSearchDate = async (): Promise<MessageEmbed> => {
  const data = await nasa.apod.get()

  const [title, desc] = ((await translateHelper
    .translate([data.title, data.explanation], 'fr'))).translations

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
  apodSearchDate,
  imageSearch,
}
