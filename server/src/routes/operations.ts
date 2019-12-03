import { Router } from 'express';
import Papa from 'papaparse';
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

declare module 'papaparse' {
  interface ParseConfig {
    delimitersToGuess?: string[];
  }
}

/**
 * Operations
 */
// Get all operations for a user
operationsRouter.get('/', async (req: any, res) => {
  if (req.user) {
    const operations = await getOperationsByUserId(req.user.id);

    operations.sort((a, b) => {
      const ret = +new Date(b.operationDate) - +new Date(a.operationDate);
      if (ret === 0) {
        console.log;
        return b.id - a.id;
      }
      return ret;
    });

    res.send({ operations });
  } else {
    res.status(401).send();
  }
});

// Read columns for a CSV file
operationsRouter.post(
  '/read-csv-col',
  upload.array('csvFiles', 1),
  async (req: any, res) => {
    if (req.user) {
      if (req.files) {
        if (req.files.length !== 1) return;

        const file = req.files[0];
        const { mimetype, size, path } = file;

        if (mimetype !== 'text/csv')
          return res.send({ error: true, message: 'Wrong file type' });
        if (size > 1000000)
          return res.send({ error: true, message: 'File is too large' });

        const csvStream = fs.createReadStream(path);
        Papa.parse(csvStream, {
          complete: results => {
            return res.send({
              error: false,
              message: 'Now please match columns',
              headers: results.meta.fields,
              path,
            });
          },
          delimitersToGuess: [';', ','],
          header: true,
        });
      }
    } else {
      return res.status(401).send();
    }
  },
);

// Add operation(s)
operationsRouter.post('/', async (req: any, res) => {
  if (req.user) {
    if (req.body.path) {
      // CSV file(s) upload
      const { colMatches, path } = req.body;
      let {
        amount = 'amount',
        category = 'category',
        date = 'date',
        label = 'label',
      } = colMatches;
      if (amount === '') amount = 'amount';
      if (date === '') date = 'date';
      if (label === '') label = 'label';
      if (category === '') category = 'category';

      const childCategories = await getChildCategories();
      const operationList: Partial<Operation>[] = [];

      const csvStream = fs.createReadStream(path);
      Papa.parse(csvStream, {
        complete: async results => {
          for (const data of results.data) {
            let operationDate = moment(
              data[date],
              ['YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY'],
              true,
            );
            if (!operationDate.isValid()) return;

            const parsedFloat = parseFloat(data[amount].replace(',', '.'));
            if (isNaN(parsedFloat) || parsedFloat == 0) return;

            let categoryId = 1;
            let parentCategoryId = 0;
            const selectedCategory = childCategories.find(
              childCategory => childCategory.title === data[category],
            );
            if (selectedCategory && selectedCategory.id) {
              categoryId = selectedCategory.id;
              parentCategoryId = selectedCategory.parentCategoryId;
            }

            if (data[label].length < 1) return;
            if (data[label].length > 255) return;

            operationList.push({
              amount: parsedFloat,
              categoryId,
              label: data[label],
              operationDate: operationDate.toDate(),
              parentCategoryId,
              userId: req.user.id,
            });
          }
          fs.unlink(path, err => {
            if (err) console.error(err);
          });
          if (operationList.length > 0) {
            await insertOperations(operationList);
          }
        },
        delimitersToGuess: [';', ','],
        header: true,
      });
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
});

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
