/** ***************************************************************************
 *  client.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 12:36 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/26 1:32 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import {
  BotOptions,
  Command,
  Commands,
  CommandInstance,
  CommandString,
} from '@ustar_travel/discord-bot'
import { Client, Message } from 'discord.js'
import { errors } from '.'
import { ConnectionHandler } from '../handlers'
import { CommandArgs } from '../helpers'
import updateStats from '../crons/memberstats'

/**
 * Bot Client Class that retrieve djs collections after login and listen events
 *
 * @class
 * */
export default class BotClient extends Client {
  /* BotOptions that contains tokens, users ids or prefix */
  private readonly config: BotOptions

  /* The Discord.js Client Object */
  public client: Client

  /* The prefix use to trigger the commands */
  public prefix: string

  /* List of all available commands */
  public commands: Commands

  /* Streaming State of the bot, he's streaming sound in VoiceChannel ? */
  public streaming: boolean

  /* ActivityTick help to define the new activity to set in the cronjob */
  public activityTick: number

  /* List of bot activities */
  public activities: Array<string>

  constructor (config: BotOptions) {
    super()
    console.log('starting bot initialization...')
    this.commands = [ // don't forget to add your new commands here or it wont run
      'debug',
      'ping',
      'invit',
      'welcome',
      'say',
      'prune',
      'bye',
      'color',
      'nasa',
      'mars',
      'astronauts',
    ]
    this.config = config
    this.prefix = config.prefix
    this.client = new Client()
    this.streaming = false
    this.activityTick = 1
    this.activities = ['les étoiles ✨', 'récupérer des infos passionnantes ! 📰']
  }

  /**
   * Discord start method that should be used after the initialization of this interface to start the bot
   *
   * @function
   *
   * @returns Promise<this>
   * */
  public async start (): Promise<this> {
    this.client.once('ready', this.ready)
    this.client.on('error', console.error)
    this.client.on('reconnecting', () => console.log('Reconnecting ...'))
    this.client.on('disconnect', () => console.warn('Disconnected'))
    this.client.on('shardDisconnect', () => console.warn('shardDisconnect'))
    this.client.on('shardError', () => console.warn('shardError'))
    this.client.on('guildBanAdd', () => updateStats(this.client))
    this.client.on('guildMemberAdd', () => updateStats(this.client))
    this.client.on('guildMemberRemove', () => updateStats(this.client))
    this.client.on('roleUpdate', () => updateStats(this.client))
    // this.client.on('voiceStateUpdate', this.voiceStateUpdate)
    this.client.on('message', msg => this.message(msg))

    await this.client.login(this.config.token)
    return this
  }

  /**
   * Discord ready event
   *
   * @function
   *
   * @returns this
   * */
  public async ready (): Promise<this> {
    console.log(`Bot ready as ${this.user?.username}`)

    await ConnectionHandler.main()

    return this
  }

  /**
   * Define the bot activity (absolutely fun purpose, base on this.activities
   *
   * @function
   *
   * @returns Promise<this>
   * */
  public async setActivity (): Promise<this> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (!this.client) return new Promise((resolve, reject) => reject(new Error('Empty guild')))
    const { user } = this.client
    if (!user) return this
    if (this.activityTick === 0) {
      await user.setActivity(this.activities[0], { type: 'WATCHING' })
      this.activityTick = 1
    } else if (this.activityTick === 1) {
      await user.setActivity(this.activities[1])
      this.activityTick = 0
    }

    return this
  }

  /**
   * Discord message event
   *
   * @function
   *
   * @returns Promise<void>
   * */
  public async message (
    message: Message,
  ): Promise<void> {
    try {
      if (!message.guild || message.channel.type === 'dm' || message.author.bot) return
      const { commands, prefix } = this

      const isValidCommandString = (
        messageContent: string,
      ): messageContent is
        CommandString => messageContent.startsWith(prefix)

      const isValidCommand = (
        command: string,
      ): command is Command => commands.includes(<Command>command)

      if (isValidCommandString(message.content)) {
        const results = message.content.match(/^!([\w]+)(.*)$/)
        if (results) {
          const [_, command, ...cmdArgs] = results
          if (isValidCommand(command)) {
            try {
              await message.delete()
              let commandModule: CommandInstance<typeof command>
              const module = await import(`../cmds/${command}.ts`)
              // eslint-disable-next-line prefer-const
              commandModule = module.default

              const unknownArgs = cmdArgs[0].trim().split(/ +/g).filter(a => a !== '')

              if (!CommandArgs.validate(
                unknownArgs,
                commandModule,
                message,
              )) return

              const args: typeof commandModule.args = unknownArgs
              commandModule.run(message, args, {
                config: this.config,
                client: this.client,
              })
            } catch (e) {
              errors.log(e)
            }
          }
        }
      }
    } catch (err) {
      errors.raiseReply(err, message)
    }
  }
}
