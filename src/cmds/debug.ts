/** *****************************************************************************
 *  cmds/debug.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |                         Created: 2021/06/21 7:14 PM
 *  |__   _|/ __/                          Updated: 2021/06/22 11:25 PM
 *     |_| |_____|U*Travel
 ***************************************************************************** */
import { Message, MessageEmbed } from 'discord.js'
import si from 'systeminformation'
import { errors } from '../core'

const advancedCpuDebug = (message: Message): void => {
  let embed
  si.currentLoad((data: Record<string, string>) => {
    embed = new MessageEmbed()
      .setColor(0x188A6C)
      .setTitle('CPU advanced debug Info')
      .setDescription('Here is some advanced CPU info')
      .addField('CPU-avgload: ', `\`${data.avgload}\``)
      .addField('CPU-currentLoad:', `\`${data.currentload} %\``)
    message.channel.send({ embed })
      .catch(err => errors.raiseReply(err, message))
  })
}

const batteryDebug = (message: Message): void => {
  let embed
  si.battery((data: Record<string, string>) => {
    embed = new MessageEmbed()
      .setColor(0x0066CC)
      .setTitle('System advanced debug info')
      .setDescription('Informations about battery')
      .addField('Battery-exists', `\`${data.hasbattery}\``)
      .addField('Battery-numberOfRecharges', `\`${data.cyclecount}\` times`)
      .addField('Battery-isCharging', `\`${data.ischarging}\``)
      .addField('Battery-maxCapacity', `\`${data.maxcapacity}\``)
      .addField('Battery-currentCapacity', `\`${data.currentcapacity}\``)
      .addField('Battery-level', `\`${data.percent} %\``)
    message.channel.send({ embed })
      .catch(err => errors.raiseReply(err, message))
  })
}

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
          embed = new MessageEmbed()
            .setTitle('Global Debug Info')
            .setColor(0x188A6C)
            .setDescription('`U*Travel Helper` - Discord Bot.')
            .addField('Made with', '`Node.js` / `TS` and `Discord.js` library (https://discord.js.org)')
            .addField('Creator', '`Made by @Сорок два#0042 <sorokdva.developer@gmail.com>`')
            .addField('Date of creation', 'Sun Jun 20 2021 1:49AM GMT+0200 (Central Europe Daylight Time)')
          message
            .reply({ embed })
            .catch(err => errors.raiseReply(err, message))
      }
      break

    default:
      errors.raiseCommand({
        command: 'debug',
        trueCommand: '!debug [type] [module].',
        example: '`!debug info`\nor\n`!debug info system`',
      }, message)
  }
}
