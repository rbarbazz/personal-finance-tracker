import { Router } from 'express';
import fs from 'fs';
import moment from 'moment';
import multer from 'multer';
import Papa from 'papaparse';

import {
  delOperation,
  getOperation,
  getOperationFromLabel,
  getOperations,
  insertOperations,
  updateOperation,
} from '../controllers/operations';
import { getChildCategories, getCategoryById } from '../controllers/categories';
import { Operation } from '../db/models';

export const operationsRouter = Router();
const upload = multer({ dest: '../../tmp/' });

// Get all operations for a user
operationsRouter.get('/', async (req, res) => {
  if (req.user) {
    const operations = await getOperations(req.user.id);

    operations.sort((a, b) => {
      const ret = +new Date(b.operationDate) - +new Date(a.operationDate);

      if (ret === 0) return b.id - a.id;
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
  async (req, res) => {
    if (req.user) {
      if (req.files) {
        if (req.files.length !== 1) return;

        const files = req.files as Express.Multer.File[];
        const file = files[0];
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
operationsRouter.post('/', async (req, res) => {
  if (req.user) {
    const userId = req.user.id;

    if (req.body.path) {
      // CSV file(s) upload
      const {
        colMatches,
        path,
      }: {
        colMatches: {
          amount: string;
          date: string;
          label: string;
          category: string;
        };
        path: string;
      } = req.body;
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
          const {
            data: rows,
          }: { data: { [index: string]: string }[] } = results;

          for (const row of rows) {
            let operationDate = moment(
              row[date],
              ['YYYY-MM-DD', 'YYYY/MM/DD', 'DD-MM-YYYY', 'DD/MM/YYYY'],
              true,
            );
            if (!operationDate.isValid()) continue;

            const parsedFloat = parseFloat(row[amount].replace(',', '.'));
            if (isNaN(parsedFloat) || parsedFloat == 0) continue;

            let categoryId = 1;
            let parentCategoryId = 0;
            const selectedCategory = childCategories.find(
              childCategory => childCategory.title === row[category],
            );
            if (selectedCategory && selectedCategory.id) {
              categoryId = selectedCategory.id;
              parentCategoryId = selectedCategory.parentCategoryId;
            } else {
              const labelWords = row[label].match(/[a-z.]{5,}/gi);

              if (labelWords) {
                const similarLabelMatch = await getOperationFromLabel(
                  userId,
                  labelWords[labelWords.length - 1],
                );

                if (similarLabelMatch.length > 0) {
                  categoryId = similarLabelMatch[0].categoryId;
                  parentCategoryId = similarLabelMatch[0].parentCategoryId;
                }
              }
            }

            if (row[label].length < 1) continue;
            if (row[label].length > 255) continue;

            operationList.push({
              amount: parsedFloat,
              categoryId,
              label: row[label],
              operationDate: operationDate.toDate(),
              parentCategoryId,
              userId,
            });
          }
          fs.unlink(path, err => {
            if (err) console.error(err);
          });
          if (operationList.length > 0) await insertOperations(operationList);
          return res.send({ error: false, message: '' });
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
        userId,
      });
      return res.send({ error: false, message: '' });
    }
  } else {
    return res.status(401).send();
  }
});

// Delete an operation
operationsRouter.delete('/:operationId', async (req, res) => {
  if (req.user) {
    const { operationId } = req.params;
    let operation = await getOperation(parseInt(operationId));

    if (operation.length > 0 && operation[0].userId === req.user.id) {
      await delOperation(parseInt(operationId));
    } else {
      return res.status(401).send();
    }
    return res.send();
  } else {
    return res.status(401).send();
  }
});

// Update an operation
operationsRouter.put('/:operationId', async (req, res) => {
  if (req.user) {
    const { operationId } = req.params;
    const operation = await getOperation(parseInt(operationId));

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

      await updateOperation(parseInt(operationId), {
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
operationsRouter.patch('/:operationId', async (req, res) => {
  if (req.user) {
    const { operationId } = req.params;
    const operation = await getOperation(parseInt(operationId));

    if (operation.length > 0 && operation[0].userId === req.user.id) {
      const { categoryId } = req.body;

      const category = await getCategoryById(categoryId);
      if (isNaN(categoryId) || category.length < 1)
        return res.send({ error: true, message: 'Wrong category' });

      await updateOperation(parseInt(operationId), {
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
