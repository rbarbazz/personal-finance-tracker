import { FireParams } from '../db/models';
import { knex } from '../db/initDatabase';

export const getFireParams = async (userId: number): Promise<FireParams[]> =>
  await knex<FireParams>('fire_params').where('userId', userId);

export const insertFireParams = async (
  fireParams: Partial<FireParams> | Partial<FireParams>[],
) => await knex<FireParams>('fire_params').insert(fireParams);

export const updateFireParams = async (
  fireParamsId: number,
  fireParams: Partial<FireParams>,
) =>
  await knex<FireParams>('fire_params')
    .where('id', fireParamsId)
    .update(fireParams);
