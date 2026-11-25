
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Informe email e senha.",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({
        error: "Credenciais inválidas.",
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        error: "Credenciais inválidas.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Chave de autenticação não configurada.",
      });
    }

    const token = jwt.sign(
      { sub: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login realizado com sucesso!",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao realizar login.",
    });
  }
}

module.exports = { login };