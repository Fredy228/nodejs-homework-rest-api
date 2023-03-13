const fs = require('fs').promises;
const uuid = require('uuid').v4;

const listContacts = async () => {
  return JSON.parse(await fs.readFile('./models/contacts.json', 'utf-8'));
};

const getContactById = async contactId => {
  const list = await listContacts();
  return list.find(item => item.id === contactId);
};

const removeContact = async contactId => {};

const addContact = async (name, email, phone) => {
  const list = await listContacts();
  const newContact = {
    id: uuid(),
    name,
    email,
    phone,
  };

  list.push(newContact);

  await fs.writeFile('./models/contacts.json', JSON.stringify(list));

  return newContact;
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
