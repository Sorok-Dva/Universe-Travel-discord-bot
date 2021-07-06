const tableName = 'users'

const up = sql => sql`
  ALTER TABLE ${sql.identifier([tableName])} 
  ADD COLUMN staff BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN muted BOOLEAN NOT NULL DEFAULT FALSE;
`

const down = sql => sql`
  ALTER TABLE ${sql.identifier([tableName])} 
  DROP COLUMN staff,
  DROP COLUMN muted;
`

module.exports = {
  up,
  down,
  tableName,
}
