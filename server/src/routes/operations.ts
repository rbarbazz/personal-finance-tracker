import { Router } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import moment from 'moment';
import multer from 'multer';

import { Operation } from '../db/models';
import {
  delOperationById,
  getOperationById,
  getOperationsByUserId,
  insertOperations,
  updateOperationById,
} from '../controllers/operations';
import { getChildCategories, getCategoryById } from '../controllers/categories';

export const operationsRouter = Router();
const upload = multer({ dest: '../../tmp/' });

/**
 * Operations
 */
// Get all operations for a user
operationsRouter.get('/', async (req: any, res) => {
  if (req.user) {
    const operations = await getOperationsByUserId(req.user.id);

    operations.sort((a, b) => {
      return +new Date(b.operationDate) - +new Date(a.operationDate);
    });

    res.send({ operations });
  } else {
    res.status(401).send();
  }
});

// Add an operation
operationsRouter.post(
  '/',
  upload.array('csvFiles', 10),
  async (req: any, res) => {
    if (req.user) {
      if (req.files) {
        // CSV file(s) upload
        const childCategories = await getChildCategories();

        for (const file of req.files) {
          const { mimetype, size, path } = file;
          if (mimetype !== 'text/csv')
            return res.send({ error: true, message: 'Wrong file type' });
          if (size > 1000000)
            return res.send({ error: true, message: 'File is too large' });

          const operationList: Partial<Operation>[] = [];
          fs.createReadStream(path)
            .pipe(csv())
            .on('data', async data => {
              const { date, amount, label, category: categoryTitle } = data;

              let operationDate = moment(
                date,
                ['YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY'],
                true,
              );
              if (!operationDate.isValid()) return;

              const parsedFloat = parseFloat(amount.replace(',', '.'));
              if (isNaN(parsedFloat) || parsedFloat == 0) return;

              let categoryId = 1;
              let parentCategoryId = 0;
              const selectedCategory = childCategories.find(
                childCategory => childCategory.title === categoryTitle,
              );
              if (selectedCategory && selectedCategory.id) {
                categoryId = selectedCategory.id;
                parentCategoryId = selectedCategory.parentCategoryId;
              }

              if (label.length < 1) return;
              if (label.length > 255) return;

              operationList.push({
                amount: parsedFloat,
                categoryId,
                label,
                operationDate: operationDate.toDate(),
                parentCategoryId,
                userId: req.user.id,
              });
            })
            .on('end', async () => {
              fs.unlink(path, err => {
                if (err) console.error(err);
              });
              if (operationList.length > 0) {
                await insertOperations(operationList);
              }
            });
        }
      } else {
        // Single operation creation
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

        const category = await getCategoryById(categoryId);
        if (isNaN(categoryId) || category.length < 1)
          return res.send({ error: true, message: 'Wrong category' });

        await insertOperations({
          amount,
          categoryId,
          label,
          operationDate,
          parentCategoryId: category[0].parentCategoryId,
          userId: req.user.id,
        });
      }

      return res.send({ error: false, message: '' });
    } else {
      return res.status(401).send();
    }
  },
);

// Delete an operation
operationsRouter.delete('/:operationId', async (req: any, res) => {
  if (req.user) {
    const { operationId } = req.params;
    let operation = await getOperationById(operationId);

    if (operation.length > 0 && operation[0].userId === req.user.id) {
      await delOperationById(operationId);
    } else {
      return res.status(401).send();
    }
    return res.send();
  } else {
    return res.status(401).send();
  }
});

// Update an operation
operationsRouter.put('/:operationId', async (req: any, res) => {
  if (req.user) {
    const { operationId } = req.params;
    const operation = await getOperationById(operationId);

    if (operation.length > 0 && operation[0].userId === req.user.id) {
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

      const category = await getCategoryById(categoryId);
      if (isNaN(categoryId) || category.length < 1)
        return res.send({ error: true, message: 'Wrong category' });

      await updateOperationById(operationId, {
        amount,
        categoryId,
        label,
        operationDate,
        parentCategoryId: category[0].parentCategoryId,
      });

      return res.send({ error: false, message: '' });
    } else {
      return res.status(401).send();
    }
  } else {
    return res.status(401).send();
  }
});

// Update category for an operation
operationsRouter.patch('/:operationId', async (req: any, res) => {
  if (req.user) {
    const { operationId } = req.params;
    const operation = await getOperationById(operationId);

    if (operation.length > 0 && operation[0].userId === req.user.id) {
      const { categoryId } = req.body;

      const category = await getCategoryById(categoryId);
      if (isNaN(categoryId) || category.length < 1)
        return res.send({ error: true, message: 'Wrong category' });

      await updateOperationById(operationId, {
        categoryId,
        parentCategoryId: category[0].parentCategoryId,
      });

      return res.send({ error: false, message: '' });
    } else {
      return res.status(401).send();
    }
  } else {
    return res.status(401).send();
  }
});
