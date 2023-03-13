const fs = require('fs').promises;

const listContacts = async () => {
  return JSON.parse(await fs.readFile('./models/contacts.json', 'utf-8'));
};

const getContactById = async contactId => {
  const list = await listContacts();
  return list.find(item => item.id === contactId);
};

const removeContact = async contactId => {};

const addContact = async body => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
