declare module '@ustar_travel/discord-bot' {
  /**
   * User Model.
   *
   * @interface
   */
  export interface User {
    /** Discord user id. */
    id: string

    /** Server Nickname. */
    nickname: string

    /** Roles assignment. */
    roles: string[]

    /** Is the Behavior Point, one system as many of moderation.
     * It decreases after each infraction
     * When the Behavior Points fall to 0, the member got banned
     */
    bp: number

    /** Messages count sent by this user on the server. */
    message_count: number

    /** Self-explanatory, the giveaway will only be for active members and not leechers */
    can_participate_giveaway: boolean

    /** Metadata */
    metadata: Record<string, unknown>
  }
}
