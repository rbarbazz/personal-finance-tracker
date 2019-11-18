interface KnexConfig {
  [key: string]: object;
}

export const knexConfig: KnexConfig = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING_DEV,
    pool: { min: 0, max: 4 },
  },
};
