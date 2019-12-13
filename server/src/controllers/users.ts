import { knex } from '../db/initDatabase';
import { User } from '../db/models';

export const getUser = async (email = '', id = 0) => {
  if (email !== '') return await knex<User>('users').where('email', email);
  if (id !== 0) return await knex<User>('users').where('id', id);
  return [];
};

export const insertUsers = async (email: string, fName: string, hash: string) =>
  await knex<User>('users')
    .returning('id')
    .insert({ email, fName, password: hash });

export const updateUser = async (userId: number, userInfo: Partial<User>) =>
  await knex<User>('users')
    .where('id', userId)
    .update(userInfo);
