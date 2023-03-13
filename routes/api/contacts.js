const express = require('express');

const { listContacts } = require('../../models/contacts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const list = await listContacts();

    res.status(200).json({ list });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
