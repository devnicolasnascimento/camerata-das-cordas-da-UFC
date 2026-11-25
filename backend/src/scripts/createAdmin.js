
require("dotenv").config();

const prisma = require("../lib/prisma");

async function createAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    throw new Error("Configure ADMIN_EMAIL e ADMIN_PASSWORD_HASH no .env");
  }

  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash: ADMIN_PASSWORD_HASH },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: ADMIN_PASSWORD_HASH,
    },
  });

  console.log("Administrador cadastrado com sucesso!");
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
