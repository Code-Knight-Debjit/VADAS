const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/ragController");

const router = express.Router();

router.use(auth);
router.get("/documents", controller.listDocuments);
router.post("/upload", controller.uploadMiddleware, controller.uploadDocument);
router.post("/query", controller.query);

module.exports = router;
