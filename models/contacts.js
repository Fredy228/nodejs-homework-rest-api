const Contact = require('./userModel');

const listContacts = async owner => {
  return await Contact.find({ owner });
};

const getContactById = async (contactId, owner) => {
  return await Contact.find({ owner, _id: contactId });
};

const removeContact = async contactId => {
  return await Contact.findByIdAndDelete(contactId);
};

const addContact = async (name, email, phone, favorite, owner) => {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner,
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
