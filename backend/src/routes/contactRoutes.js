const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/contactController");

const router = express.Router();

router.use(auth);
router.get("/", controller.listContacts);
router.post("/", controller.createContact);
router.patch("/:id", controller.updateContact);
router.delete("/:id", controller.deleteContact);

module.exports = router;
