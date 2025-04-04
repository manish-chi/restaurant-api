const express = require("express");
const router = express.Router();
const navigationController = require("../controllers/navigationController");

router.route("/").get(navigationController.getMainNavigationMenus);

module.exports = router;
