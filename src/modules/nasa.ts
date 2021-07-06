import { env } from '@materya/carbon'
import { nasa } from '../connectors'
import { MessageEmbed } from 'discord.js'

const apod = async (): Promise<MessageEmbed> => {
  const data = await nasa.apod.get()
  console.log(data)
  return new MessageEmbed()
    .setColor('RANDOM')
    .setTitle(data.title)
    .setDescription(`<@&853036396205834261>, ${data.explanation}`)
    .setImage(data.hdurl)
    .addField('Copyright', data.copyright, true)
    .addField('Date:', data.date, true)
    .setFooter('Récupérée via l\'api de la NASA')
    .setTimestamp()
}

export {
  apod,
}
