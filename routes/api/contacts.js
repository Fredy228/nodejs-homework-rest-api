const express = require('express');

const {
  listContacts,
  getContactById,
  addContact,
} = require('../../models/contacts');

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
  try {
    const { name, email, phone } = req.body;
    const list = await listContacts();

    if (list.find(item => item.email === email || item.phone === phone)) {
      return res.status(400).json({ message: 'Such contact already exists' });
    }

    if (name === undefined || email === undefined || phone === undefined) {
      return res.status(400).json({ message: 'missing required name field' });
    }

    const addedContact = await addContact(name, email, phone);

    res.status(201).json({ addedContact });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
