const express = require('express');
const Joi = require('joi');
const Contact = require('../../models/userModel');
const tokenCheck = require('../../middleware/tokenCheck');

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
  email: Joi.string().email().required(),
});

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

router.use(tokenCheck.protect);

router.get('/', async (req, res, next) => {
  try {
    const list = await listContacts();

    res.status(200).json({ list });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const isValid = schema.validate(req.body);
    const { name, email, phone, favorite } = isValid.value;
    const findContact = await Contact.find({ email, phone });

    if (isValid.error) {
      return res.status(400).json({ message: 'Not valide query' });
    }

    if (findContact.length > 0) {
      return res.status(400).json({ message: 'Such contact already exists' });
    }

    const addedContact = await addContact(name, email, phone, favorite);

    res.status(201).json({ addedContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const exists = await Contact.exists({ _id: contactId });

    if (!exists) return res.status(404).json({ message: 'Not found' });

    await removeContact(contactId);

    res.status(200).json({ message: 'contact deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const exists = await Contact.exists({ _id: contactId });

    if (!exists) return res.status(404).json({ message: 'Not found' });
    console.log(req.body);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing fields' });
    }

    const contact = await updateContact(contactId, req.body);

    res.status(200).json({ contact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const exists = await Contact.exists({ _id: contactId });

    if (!exists) return res.status(404).json({ message: 'Not found' });
    const { favorite } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing fields' });
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      {
        favorite,
      },
      { new: true }
    );

    res.status(200).json({ contact });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
