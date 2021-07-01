const up = sql => sql`
  CREATE OR REPLACE FUNCTION refresh_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER refresh_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE refresh_updated_at();
`

const down = sql => sql`
  DROP TRIGGER refresh_updated_at_addresses_trigger
  ON users;
`

module.exports = {
  up,
  down,
}
