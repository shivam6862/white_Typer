const path = require("path");

const express = require("express");

const adminController = require("../controllers/typing");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/typing", isAuth, adminController.getAddTyping );

router.get("/reset", adminController.getFinalReset);

router.post("/typing", adminController.postAddTyping );

router.post("/reset", adminController.postFinalReset);

router.get("/demotyping", adminController.getAddDemoTyping);

module.exports = router;
