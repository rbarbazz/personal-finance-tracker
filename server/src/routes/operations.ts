import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';

import { knex } from '../db/initDatabase';
import { OperationRow, Operation, Category } from '../db/models';

export const operationsRouter = Router();
const upload = multer({ dest: '../../tmp/' });

/**
 * Operations
 */
// Get all operations
operationsRouter.get('/operations', async (req: any, res) => {
  if (req.user) {
    const operations: OperationRow[] = await knex<Operation>('operations')
      .select(
        'operations.id',
        'operationDate',
        'amount',
        'label',
        'categories.title as categoryTitle',
        'categoryId',
      )
      .leftJoin('categories', { 'operations.categoryId': 'categories.id' })
      .where('userId', req.user.id)
      .orderBy('operationDate', 'desc');

    res.send({ operations });
  } else {
    res.status(401).send();
  }
});

// Add an operation
operationsRouter.post(
  '/operations',
  upload.array('csvFiles', 10),
  async (req: any, res) => {
    if (req.user) {
      if (req.files) {
        await req.files.forEach(async (file: Express.Multer.File) => {
          const { mimetype, size, path } = file;

          if (mimetype !== 'text/csv')
            return res.send({ error: true, message: 'Wrong file type' });
          if (size > 1000000)
            return res.send({ error: true, message: 'File is too large' });

          const operationList: Operation[] = [];
          const categories = await knex<Category>('categories').select();

          fs.createReadStream(path)
            .pipe(csv({ separator: ';' }))
            .on('data', data => {
              const { date, amount, label, category: categoryTitle } = data;
              const operationDate = new Date(date);
              const parsedFloat = parseFloat(amount.replace(',', '.'));
              let categoryId = 1;
              const found = categories.find(
                category => category.title === categoryTitle,
              );

              if (found && found.id) categoryId = found.id;
              if (isNaN(operationDate.getDate())) return;
              if (isNaN(parsedFloat) || parsedFloat == 0) return;
              if (label.length < 1) return;
              if (label.length > 255) return;

              operationList.push({
                operationDate,
                amount: parsedFloat,
                label,
                categoryId,
                userId: req.user.id,
              });
            })
            .on('end', async () => {
              fs.unlink(path, err => {
                if (err) console.error(err);
              });
              if (operationList.length > 0) {
                await knex<Operation>('operations').insert(operationList);
              }
            });
        });
        res.send({ error: false, message: '' });
      } else {
        const {
          operationDate: operationDateStr,
          amount,
          label,
          categoryId,
        } = req.body;
        const operationDate = new Date(operationDateStr);

        if (isNaN(operationDate.getDate()))
          return res.send({ error: true, message: 'Wrong date' });
        if (isNaN(amount) || amount == 0)
          return res.send({ error: true, message: 'Wrong amount' });
        if (label.length < 1)
          return res.send({ error: true, message: 'Label is too short' });
        if (label.length > 255)
          return res.send({ error: true, message: 'Label is too long' });
        if (isNaN(categoryId))
          return res.send({ error: true, message: 'Wrong category' });

        await knex<Operation>('operations').insert({
          operationDate,
          amount,
          label,
          categoryId,
          userId: req.user.id,
        });

        return res.send({ error: false, message: '' });
      }
    } else {
      return res.status(401).send();
    }
  },
);

// Delete an operation
operationsRouter.delete('/operations/:operationId', async (req: any, res) => {
  if (req.user) {
    const { operationId } = req.params;
    const operation = await knex<Operation>('operations')
      .where('id', operationId)
      .first();

    if (operation && operation.userId && operation.userId === req.user.id) {
      await knex<Operation>('operations')
        .where('id', operationId)
        .del();
    } else {
      return res.status(401).send();
    }
    return res.send();
  } else {
    return res.status(401).send();
  }
});

// Update an operation
operationsRouter.put('/operations/:operationId', async (req: any, res) => {
  if (req.user) {
    const { operationId } = req.params;
    const operation = await knex<Operation>('operations')
      .where('id', operationId)
      .first();

    if (operation && operation.userId && operation.userId === req.user.id) {
      const {
        operationDate: operationDateStr,
        amount,
        label,
        categoryId,
      } = req.body;
      const operationDate = new Date(operationDateStr);

      if (isNaN(operationDate.getDate()))
        return res.send({ error: true, message: 'Wrong date' });
      if (isNaN(amount) || amount == 0)
        return res.send({ error: true, message: 'Wrong amount' });
      if (label.length < 1)
        return res.send({ error: true, message: 'Label is too short' });
      if (label.length > 255)
        return res.send({ error: true, message: 'Label is too long' });
      if (isNaN(categoryId))
        return res.send({ error: true, message: 'Wrong category' });

      await knex<Operation>('operations')
        .where('id', operationId)
        .update({
          operationDate,
          amount,
          label,
          categoryId,
        });

      return res.send({ error: false, message: '' });
    } else {
      return res.status(401).send();
    }
  } else {
    return res.status(401).send();
  }
});
