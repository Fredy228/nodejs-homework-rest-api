const Contact = require('./userModel');

const listContacts = async () => {
  return await Contact.find({});
};

const getContactById = async contactId => {
  return await Contact.findById(contactId);
};

const removeContact = async contactId => {
  return await Contact.findByIdAndDelete(contactId);
};

const addContact = async (name, email, phone, favorite) => {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    favorite,
  });

  return newContact;
};

const updateContact = async (contactId, { name, email, phone, favorite }) => {
  return await Contact.findByIdAndUpdate(
    contactId,
    {
      name,
      email,
      phone,
      favorite,
    },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
