/** ***************************************************************************
 *  core/client.ts
 *   _  _   ____      Author: Сорок два <sorokdva.developer@gmail.com>
 *  | || | |___ \
 *  | || |_  __) |            Created: 2021/06/20 12:36 AM by Сорок два
 *  |__   _|/ __/             Updated: 2021/06/23 10:27 PM by Сорок два
 *     |_| |_____|U*Travel
 *************************************************************************** */
import { BotOptions, Command, Commands } from '@ustar_travel/discord-bot'
import { Client, Guild, Message } from 'discord.js'
import { errors } from '.'
import { ConnectionHandler } from '../handlers'

/**
 * Bot Client Class that retrieve djs collections after login and listen events
 *
 * @class
 * */
export default class BotClient extends Client {
  /* BotOptions that contains tokens, users ids or prefix */
  private readonly config: BotOptions

  /* The Discord.js Client Object */
  private client: Client | null

  /* The main guild (this bot is not configured for a multi-servers but specially only one) */
  public guild: Guild | null

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
    this.commands = [
      'debug',
      'invit',
      'say',
      'servers',
      'ping',
      'prune',
      'reload',
    ]
    this.config = config
    this.prefix = config.prefix
    this.client = null
    this.guild = null
    this.streaming = false
    this.activityTick = 1
    this.activities = ['les étoiles ✨', 'récupérer des infos passionnantes ! 📰']
  }

  /**
   * Discord start method thet should be used after the initialization of this interface to start the bot
   *
   * @function
   *
   * @returns Promise<this>
   * */
  public async start (): Promise<this> {
    const client = new Client()

    client.once('ready', this.ready)
    client.on('error', console.error)
    client.on('reconnecting', () => console.log('Reconnecting ...'))
    client.on('disconnect', () => console.warn('Disconnected'))
    client.on('shardDisconnect', () => console.warn('shardDisconnect'))
    client.on('shardError', () => console.warn('shardError'))
    client.on('message', msg => this.message(
      msg,
      this.prefix,
      this.commands,
    ))

    await client.login(this.config.token)
    this.client = client
    return this
  }

  /**
   * Discord ready event
   *
   * @function
   *
   * @returns this
   * */
  public ready (): this {
    console.log(`Bot ready as ${this.user?.username} to help this awesome community !`)

    ConnectionHandler.main(this)

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
    prefix: string,
    commands: Commands,
  ): Promise<void> {
    try {
      if (!message.guild || message.channel.type === 'dm' || message.author.bot) return
      if (!message.content.startsWith(prefix)) return

      const args: Array<string> = message.content.slice(prefix.length).trim().split(/ +/g)

      // @ts-ignore
      const command: Command = args.shift().toLowerCase()
      if (commands.includes(command)) {
        await message.delete()

        // todo rework this to be TS compliant
        const commandFile = require(`/build/dist/cmds/${command}.js`)
        commandFile.run(message, args, this.config)
      }
    } catch (err) {
      errors.raiseReply(err, message)
    }
  }
}
