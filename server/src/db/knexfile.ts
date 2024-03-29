import { knexSnakeCaseMappers } from 'objection'

export const knexConfig: { [env: string]: object } = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING_DEV,
    ...knexSnakeCaseMappers(),
    pool: { min: 0, max: 5 },
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    ...knexSnakeCaseMappers(),
    pool: { min: 0, max: 20 },
  },
}
