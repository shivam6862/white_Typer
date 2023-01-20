const path = require("path");

const express = require("express");

const resultController = require("../controllers/result");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", resultController.getStart);

router.get("/result", isAuth, resultController.getFinalResult);

router.get("/histroy", isAuth, resultController.getFinalHistroy);

router.post("/histroy-delete-item", isAuth, resultController.postDeleteHistroy);

module.exports = router;
