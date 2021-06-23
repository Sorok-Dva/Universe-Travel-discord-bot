/** ***************************************************************************
 *  iss.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/23 11:45 PM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 11:45 PM by Сорок два
 *     |_| |_____|
 *************************************************************************** */

import { Message, MessageEmbed } from 'discord.js'
import si from 'systeminformation'
import { errors } from '../core'

exports.run = (
  message: Message,
  args: Array<number | string>,
): void => {
  const [type, module] = args
  let embed
  switch (type) {
    case 'info':
      switch (module) {
        case 'system':
          si.osInfo((data: Record<string, string>) => {
            embed = new MessageEmbed()
              .setColor(0x188A6C)
              .setTitle('System Debug Info')
              .setDescription('Here is all the host system informations.')
              .addField('System-OS', `\`${data.platform}\``)
              .addField('System-distro', `\`${data.distro}\``)
              .addField('System-release', `\`${data.release}\``)
              .addField('System-codeName', `\`${data.codename}\``)
              .addField('System-kernel', `\`${data.kernel}\``)

            message
              .reply({ embed })
              .catch(err => errors.raiseReply(err, message))

            batteryDebug(message)
          })
          break
        case 'cpu':
          si.cpu((data: Record<string, string>) => {
            embed = new MessageEmbed()
              .setColor(0x188A6C)
              .setTitle('CPU Debug Info')
              .addField('CPU-manufacturer:', `\`${data.manufacturer}\``)
              .addField('CPU-brand:', `\`${data.brand}\``)

            message
              .reply({ embed })
              .catch(err => errors.raiseReply(err, message))

            advancedCpuDebug(message)
          })
          break
        case 'network':
          si.networkStats((data: Record<string, string>) => {
            embed = new MessageEmbed()
              .setColor(0x188A6C)
              .setTitle('Network Debug Info')
              .setDescription('Network Interface Stats (eth1):')
              .addField('- is up: ', data.operstate)
              .addField('- RX bytes overall: ', data.rx)
              .addField('- TX bytes overall: ', data.tx)
              .addField('- RX bytes/sec: ', data.rx_sec)
              .addField('- TX bytes/sec: ', data.tx_sec)

            message
              .reply({ embed })
              .catch(err => errors.raiseReply(err, message))
          })
          break
        default:
      }
      break

    default:
      errors.raiseCommand({
        command: 'iss',
        trueCommand: '!iss [subcommand] [args].',
        example: '`!iss info`\nor\n`!iss passage paris`',
      }, message)
  }
}
