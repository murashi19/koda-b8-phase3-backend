import { constants } from "node:http2";
import { verifyToken } from "../lib/jwt";

/**
 * @param {import{"express"}.Request} req
 * @param {import{"express"}.Response} res
 * @param {function()} next
 */

function authMiddleware(req, res, next) {
  const authHeader = req.Header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: Token not found",
    });
  }
  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: Token is invalid or expired",
    });
  }
}

export default authMiddleware;
