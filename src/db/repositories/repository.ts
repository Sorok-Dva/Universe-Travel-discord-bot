/* eslint-disable @typescript-eslint/naming-convention */
import { sql } from 'slonik'

import type {
  EntityFields,
  EntitySubset,
  Repository,
  RepositoryOpts,
  RepositoryReturnType,
  TableName,
} from '@ustar_travel/discord-bot'

import type {
  DatabasePoolType,
  IdentifierSqlTokenType,
  SqlSqlTokenType,
} from 'slonik'

const queryBuilder = <M, F extends EntityFields<M>>(
  tableName: IdentifierSqlTokenType,
  opts?: RepositoryOpts<M, F>,
): SqlSqlTokenType => {
  const fields = opts?.fields
    ? sql.join(opts.fields.map(f => sql.identifier([f])), sql`, `)
    : sql`*`
  const whereClause = opts?.filters && Object.entries(opts.filters)
    .map(([key, value]) => (
      (value instanceof Array)
        ? sql`${sql.identifier([key])} IN (${sql.join(value, sql`, `)})`
        : sql`${sql.identifier([key])} = ${value}`
    ))
  const orderByClause = opts?.orderBy && opts.orderBy.map(expr => {
    const [f, o = 'DESC'] = expr.split(' ')
    return sql`${sql.identifier([f])} ${o === 'DESC' ? sql`DESC` : sql`ASC`}`
  })

  const query = sql`
    SELECT ${fields}
    FROM ${tableName}
    ${whereClause ? sql`WHERE ${sql.join(whereClause, sql` AND `)}` : sql``}
    ${orderByClause ? sql`ORDER BY ${sql.join(orderByClause, sql`,`)}` : sql``}
    ${opts?.limit ? sql`LIMIT ${opts.limit}` : sql``}
  `

  return query
}

const repo = <M>(pool: DatabasePoolType, table: TableName): Repository<M> => {
  const tableName = sql.identifier([table])

  /**
   * one query
   *
   * @param opts - repository query opts
   * @param opts.fields - fields subset to return.
   * @param opts.filters - some opts
   * @returns a single entity as defined by `opts` from the given repository model
   * @throws
   */
  async function one <F extends EntityFields<M>> (
    opts: Omit<RepositoryOpts<M, F>, 'limit'> & { shouldRaiseOnEmpty?: true }
  ): Promise<
    | RepositoryReturnType<M, NonNullable<typeof opts>['fields']>
    >
  async function one <F extends EntityFields<M>> (
    opts: Omit<RepositoryOpts<M, F>, 'limit'> & { shouldRaiseOnEmpty: false }
  ): Promise<
    | RepositoryReturnType<M, NonNullable<typeof opts>['fields']>
    | null
    >
  async function one <F extends EntityFields<M>> (
    opts: RepositoryOpts<M, F> = {},
  ): Promise<
    | RepositoryReturnType<M, NonNullable<typeof opts>['fields']>
    | null
    > {
    const { fields, filters, shouldRaiseOnEmpty = true } = opts
    const query = queryBuilder(tableName, { fields, filters, limit: 1 })
    const queryMethod = shouldRaiseOnEmpty ? pool.one : pool.maybeOne
    const entity = await queryMethod<
      EntitySubset<M, NonNullable<typeof fields>[number]>
      >(query)

    return entity
  }

  /**
   * Many queries
   *
   * @param opts - some opts
   * @returns array of entities
   */
  async function many <F extends EntityFields<M>> (
    opts?: RepositoryOpts<M, F>,
  ): Promise<
    | readonly RepositoryReturnType<M, NonNullable<typeof opts>['fields']>[]
    > {
    const query = queryBuilder(tableName, opts)
    const entities = await pool.many<
      RepositoryReturnType<M, NonNullable<typeof opts>['fields']>
      >(query)

    return entities
  }

  return {
    many,
    one,
  }
}

export default repo
