
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Acesso não autorizado.",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.adminId = decoded.sub;

    next();
  } catch {
    return res.status(401).json({
      error: "Token inválido ou expirado.",
    });
  }
}

module.exports = authMiddleware;
