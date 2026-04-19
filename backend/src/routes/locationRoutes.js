const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/locationController");

const router = express.Router();

router.use(auth);
router.post("/", controller.createLocationLog);
router.get("/", controller.listLocationLogs);

module.exports = router;
