
const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    },
});

router.post("/login", loginLimiter, login);

module.exports = router;
