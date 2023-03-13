const fs = require('fs').promises;
const uuid = require('uuid').v4;

const listContacts = async () => {
  return JSON.parse(await fs.readFile('./models/contacts.json', 'utf-8'));
};

const getContactById = async contactId => {
  const list = await listContacts();
  return list.find(item => item.id === contactId);
};

const removeContact = async contactId => {
  const list = await listContacts();

  const newList = await list.filter(item => item.id !== contactId);

  await fs.writeFile('./models/contacts.json', JSON.stringify(newList));
};

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

const updateContact = async (contactId, { name, email, phone }) => {
  const list = await listContacts();
  const index = list.findIndex(item => item.id === contactId);
  const contact = list[index];

  if (name) contact.name = name;
  if (email) contact.email = email;
  if (phone) contact.phone = phone;

  list[index] = contact;

  await fs.writeFile('./models/contacts.json', JSON.stringify(list));

  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
