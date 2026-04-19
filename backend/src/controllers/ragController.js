const path = require("path");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const KnowledgeDocument = require("../models/KnowledgeDocument");
const { ingestDocument, queryKnowledgeBase } = require("../services/ragService");

const upload = multer({
  dest: path.join(__dirname, "../rag/uploads")
});

exports.uploadMiddleware = upload.single("document");

exports.uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Document file is required" });
  }

  const record = await KnowledgeDocument.create({
    title: req.body.title || req.file.originalname,
    filename: req.file.filename,
    mimeType: req.file.mimetype,
    uploadedBy: req.user._id
  });

  const result = await ingestDocument({
    file: req.file,
    documentId: String(record._id),
    title: record.title
  });

  record.chunks = result.chunkCount;
  await record.save();

  res.status(201).json(record);
});

exports.listDocuments = asyncHandler(async (req, res) => {
  const documents = await KnowledgeDocument.find().sort({ createdAt: -1 });
  res.json(documents);
});

exports.query = asyncHandler(async (req, res) => {
  const result = await queryKnowledgeBase(req.body.question);
  res.json(result);
});
