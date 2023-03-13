const express = require('express');

const { listContacts, getContactById } = require('../../models/contacts');

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
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      return res.status(200).json({ contact });
    }
    res.status(404).json({ message: 'Not found' });
  } catch (error) {
    res.status(400).json({ error });
  }
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
