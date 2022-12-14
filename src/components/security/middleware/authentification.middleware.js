import * as Response from "../../../common/service/Http/Response.js";
import UserRepository from "../../user/repository/user.repository.js";
import TokenService from "../service/jwt/token.service.js";
import AntispamService from "../service/antispam/antispam.service.js";

/**
 * Middleware to check if the user is authenticated
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {Promise<*>}
 */
const AuthentificationMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return Response.unauthorized(req, res, "No token provided");
  }

  const [type, token] = header.split(/\s+/);

  if (type !== "Bearer") {
    return Response.unauthorized(req, res, "Invalid token type");
  }

  const tokenService = new TokenService();
  let user = await tokenService.validate(token);

  if (user) {
    try {
      const userRepository = new UserRepository();
      user = await userRepository.find(user.id);

      if (user.isActive === false) {
        return Response.unauthorized(req, res, "You're account is not active");
      }

      req.user = user;
      next();
    } catch (err) {
      await (new AntispamService).createAuthenticationAttemptError(req.body.ip, req.body);
      Response.forbidden(req, res);
    }
  } else {
    return Response.unauthorized(req, res, "Invalid token");
  }
};

export default AuthentificationMiddleware;
