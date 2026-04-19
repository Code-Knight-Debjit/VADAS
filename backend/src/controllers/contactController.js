const asyncHandler = require("../utils/asyncHandler");
const Contact = require("../models/Contact");

exports.listContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id }).sort({ priority: 1, createdAt: -1 });
  res.json(contacts);
});

exports.createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    userId: req.user._id
  });

  res.status(201).json(contact);
});

exports.updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  return res.json(contact);
});

exports.deleteContact = asyncHandler(async (req, res) => {
  const deleted = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!deleted) {
    return res.status(404).json({ message: "Contact not found" });
  }

  return res.status(204).send();
});
