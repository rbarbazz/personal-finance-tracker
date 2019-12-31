import { FireParams } from '../db/models';
import { knex } from '../db/initDatabase';

export const insertFireParams = async (
  fireParams: Partial<FireParams> | Partial<FireParams>[],
) => await knex<FireParams>('fire_params').insert(fireParams);
