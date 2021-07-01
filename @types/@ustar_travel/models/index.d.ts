declare module '@ustar_travel/discord-bot' {
  /**
   * Entity primary key.
   *
   * @alias PrimaryKey
   */
  type PrimaryKey = Opaque<'PrimaryKey', string>

  /**
   * Model table name.
   *
   * @alias TableName
   */
  type TableName = Opaque<'TableName', string>

  /**
   * Interface for persisted fields in database for a given model.
   *
   * @alias PersistenceColumns
   */
  type PersistenceColumns = {
   /** Persisted entity id. */
    id: PrimaryKey

   /** Creation date of the entity. */
    created_at: Date

   /** Update date of the entity. */
    updated_at: Date

   /** Soft deletion date of the entity. */
    deleted_at?: Date
  }

  /**
   * Full entity from DB.
   *
   * @alias Entity
   */
  type Entity<M> = M & PersistenceColumns

  /**
   * Subset of an entity from DB.
   *
   * @alias EntitySubset
   */
  type EntitySubset<M, F extends keyof Entity<M>> = {
    [K in F]: NonNullable<Entity<M>[K]>
  }

   import type { DatabaseTransactionConnectionType } from 'slonik'

  type Ordering =
    | 'DESC'
    | 'ASC'

  /**
   * Retrieve only `string` keys from a given model.
   *
   * Used for iteration compatibility purposes
   */
  type EntityFields<M> = Extract<keyof Entity<M>, string>

  /**
   * Common Factory Options.
   *
   * @interface
   */
  interface FactoryOpts<M, F extends keyof Entity<M>> {
    /** Limit fields to return on insert/update. */
    returning?: Array<F>

    /** switch to ignore conflicts on insert/update */
    shouldIgnoreConflicts?: boolean

    /** database transaction */
    transaction?: DatabaseTransactionConnectionType

    /** unique constraint columns name */
    uniqueConstraintColumnNames?: Array<keyof Entity<M>>
  }

  /**
   * Factory.
   */
  interface Factory<M> {
    create: <F extends EntityFields<M>> (
      attrs: M,
      opts?: FactoryOpts<M, F>,
    ) => Promise<
      NonNullable<typeof opts>['returning'] extends undefined
        ? Entity<M>
        : EntitySubset<
          M,
          NonNullable<NonNullable<typeof opts>['returning']>[number]
        >
    >

    update: <F extends EntityFields<M>> (
      id: PrimaryKey,
      attrs: Partial<M>,
      opts?: FactoryOpts<M, F>,
    ) => Promise<
      NonNullable<typeof opts>['returning'] extends undefined
        ? Entity<M>
        : EntitySubset<
          M,
          NonNullable<NonNullable<typeof opts>['returning']>[number]
        >
    >

    upsert: <F extends EntityFields<M>> (
      attrs: Partial<M>,
      // filters: Partial<M>,
      opts?: FactoryOpts<M, F>,
    ) => Promise<PrimaryKey>
  }

  /**
   * Extract possible filter values from a model `M`
   */
  type Filters<M> = {
    [K in keyof Partial<Entity<M>>]: Entity<M>[K] | Array<Entity<M>[K]>
  }

  /**
   * Order by possible values from a model `M`
   */
  type OrderFragment<M> =
    | `${string & keyof Entity<M>}`
    | `${string & keyof Entity<M>} ${Ordering}`

  type OrderBy<M> = OrderFragment<M>[]

  /**
   * Common Repository Options.
   *
   * @interface
   */
  interface RepositoryOpts<M, F extends keyof Entity<M>> {
    /** Limit fields to return. */
    fields?: Array<F>

    /** Where clause. */
    filters?: Filters<M>

    /** Limit clause. */
    limit?: number

    /** Order By clause. */
    orderBy?: OrderBy<M>

    /** whether no result is considered a problem or not. */
    shouldRaiseOnEmpty?: boolean
  }

  /**
   * Standardize repository return type to use on all subset methods.
   */
  type RepositoryReturnType<M, F extends EntityFields<M>[] | undefined> =
    F extends undefined
      ? Entity<M>
      : EntitySubset<M, NonNullable<F>[number]>

  /**
   * Retrieve one entity from a given model table.
   */
  type RepositoryOne<M> =
    & (<F extends EntityFields<M>> (
        opts: Omit<RepositoryOpts<M, F>, 'limit'> & {shouldRaiseOnEmpty?: true }
      ) => Promise<
        | RepositoryReturnType<M, NonNullable<typeof opts>['fields']>
      >)
    & (<F extends EntityFields<M>> (
      opts: Omit<RepositoryOpts<M, F>, 'limit'> & { shouldRaiseOnEmpty: false }
      ) => Promise<
        | RepositoryReturnType<M, NonNullable<typeof opts>['fields']>
        | null
      >)

  /**
   * Repository.
   */
  interface Repository<M> {
    many: <F extends EntityFields<M>> (
      opts?: RepositoryOpts<M, F>
    ) => Promise<
      | readonly RepositoryReturnType<M, NonNullable<typeof opts>['fields']>[]
    >
    one: RepositoryOne<M>
  }
}
