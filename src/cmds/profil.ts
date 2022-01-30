/** ***************************************************************************
 *  cmds/profil.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2022/01/30 5:41 AM by Сорок два
 *  |__   _|/ __/             Updated: 2022/01/30 5:41 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { CommandEntity } from '@ustar_travel/discord-bot'
import { Message, MessageEmbed } from 'discord.js'
import { dbHelper, levelHelper } from '../helpers'
import { errors } from '../core'

type Args = readonly string[]

const run = async (message: Message, args: Args): Promise<void> => {
  const [nickname] = args
  console.log(nickname)
  const dbUser = await dbHelper.getUser(nickname ?? message.author.id)
  const {
    bp,
    can_participate_giveaway: giveaway,
    message_count: messageCount,
    staff,
  } = dbUser

  const embed = new MessageEmbed()
    .setColor('DARK_GREEN')
    .setTitle(`Profil de ${message.author.username}`)
    .addField('Niveau', `${levelHelper.calculate(messageCount)} *(messages: ${messageCount})*`)
    .addField('Point de comportement', bp)
    .addField('Peut participer aux giveaways', giveaway ? 'Oui' : 'Non')
    .addField('Membre du staff', staff ? 'Oui' : 'Non')

  if (message.author.avatar) {
    embed.setThumbnail(<string>message.author.avatarURL())
  }

  await message.channel.send(embed).then(msg => msg.delete({ timeout: 30000 }))
    .catch(err => errors.log(err))
}

const command: CommandEntity<string> = {
  title: 'profil',
  desc: 'Vous donnes les informations de votre profil ou de celui d\'un autre utilisateur',
  args: [],
  mandatoryArgs: false,
  usage: 'profil',
  examples: ['profil', 'profil @pseudo'],
  run,
}

export default command
