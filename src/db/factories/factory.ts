import { sql } from 'slonik'
import { upsert } from 'slonik-utilities'

import type {
  Entity,
  EntityFields,
  EntitySubset,
  Factory,
  FactoryOpts,
  PrimaryKey,
  TableName,
} from '@ustar_travel/discord-bot'
import type {
  DatabasePoolType,
  ValueExpressionType,
} from 'slonik'

const factory = <M>(pool: DatabasePoolType, table: TableName): Factory<M> => {
  const tableName = sql.identifier([table])

  const sanitizeAttrs = (attrs: Partial<M>): Partial<M> => (
    Object.keys(attrs).reduce((filtered, k) => {
      const value = attrs[<keyof Partial<M>>k]
      const sanitizedValue = (v: unknown): unknown => {
        if (v instanceof Date) return v.toUTCString()
        if (typeof v === 'object' && v?.constructor === Object) {
          return JSON.stringify(v)
        }
        if (Array.isArray(v)) return JSON.stringify(v)

        return v ?? null
      }
      return {
        ...filtered,
        ...(value !== undefined && { [k]: sanitizedValue(value) }),
      }
    }, {})
  )

  return {
    create: async <F extends EntityFields<M>> (
      attrs: M,
      opts?: FactoryOpts<M, F>,
    ): Promise<
      NonNullable<typeof opts>['returning'] extends undefined
      ? Entity<M>
      : EntitySubset<M, NonNullable<NonNullable<typeof opts>['returning']>[number]>
    > => {
      try {
        const sanitizedAttrs = sanitizeAttrs(attrs)

        const keys = sql.join(Object.keys(sanitizedAttrs)
          .map(k => sql.identifier([k])), sql`, `)
        const values = sql.join(Object.values(sanitizedAttrs), sql`, `)

        type QueryReturnType = NonNullable<typeof opts>['returning'] extends undefined
          ? Entity<M>
          : EntitySubset<M, NonNullable<NonNullable<typeof opts>['returning']>[number]>
        const returning = opts?.returning
          ? sql.join(opts.returning.map(r => sql.identifier([r])), sql`, `)
          : sql`*`

        const query = sql<QueryReturnType>`
          INSERT INTO ${tableName} (${keys})
          VALUES (${values})
          RETURNING ${returning}
        `

        const entity = await (opts?.transaction ?? pool)
          .one<QueryReturnType>(query)

        return entity
      } catch (error) {
        console.error(table, attrs, error)
        throw new Error(error)
      }
    },

    update: async <F extends EntityFields<M>> (
      id: PrimaryKey,
      attrs: Partial<M>,
      opts?: FactoryOpts<M, F>,
    ): Promise<
      NonNullable<typeof opts>['returning'] extends undefined
      ? Entity<M>
      : EntitySubset<M, NonNullable<NonNullable<typeof opts>['returning']>[number]>
    > => {
      try {
        const sanitizedAttrs = sanitizeAttrs(attrs)
        const sets = Object.entries(sanitizedAttrs)
          .map(([k, v]) => sql`${sql.identifier([k])} = ${<ValueExpressionType>v}`)

        type QueryReturnType = NonNullable<typeof opts>['returning'] extends undefined
          ? Entity<M>
          : EntitySubset<M, NonNullable<NonNullable<typeof opts>['returning']>[number]>
        const returning = opts?.returning
          ? sql.join(opts.returning.map(r => sql.identifier([r])), sql`, `)
          : sql`*`

        const query = sql<QueryReturnType>`
          UPDATE ${tableName}
          SET ${sql.join(sets, sql`, `)}
          WHERE id = ${id}
          RETURNING ${returning}
        `

        const entity = await (opts?.transaction ?? pool)
          .one<QueryReturnType>(query)

        return entity
      } catch (error) {
        console.error(table, attrs, error)
        throw new Error(error)
      }
    },

    upsert: async (
      attrs,
      opts,
    ): Promise<PrimaryKey> => {
      const sanitizedAttrs = sanitizeAttrs(attrs)

      try {
        const id = await upsert(
          pool,
          table,
          sanitizedAttrs,
          opts?.uniqueConstraintColumnNames,
        )

        return id
      } catch (error) {
        console.error(table, attrs, error)
        throw new Error(error)
      }
    },
  }
}

export default factory
