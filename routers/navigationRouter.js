import express from "express";
import * as navigationController from "../controllers/navigationController.js";

const router = express.Router();
router.route("/").get(navigationController.getMainNavigationMenus);

export default router;
