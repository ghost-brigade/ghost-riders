import * as Response from "../../../common/service/Http/Response.js";
import Controller from "../../../common/controller/controller.js";
import PasswordResetRepository from "../repository/passwordReset.repository.js";
import GenerateResetPasswordTokenService from "../service/security/generateResetPasswordToken.service.js";
import UserRepository from "../../user/repository/user.repository.js";
import emailEvent from "../../email/event/email.event.js";
import Email from "../../email/email.js";
import TokenValidityService from "../service/token/tokenValidity.service.js";
import config from "../../../../config.js";

class PasswordRequestController extends Controller {

  constructor() {
    super();
    config.env();
    this.userRepository = new UserRepository();
    this.passwordResetRepository = new PasswordResetRepository();
  }

  /**
   * Request a password reset
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<*>}
   */
  request = async (req, res) => {
    if (req.body === undefined || req.body.email === undefined) {
      return Response.unprocessableEntity(req, res, "Missing parameters");
    }

    const {email} = req.body;

    if (email === undefined) {
      return Response.unprocessableEntity(req, res, "Missing Email");
    }

    const user = await this.userRepository.findByEmail(email);

    if (user === null) {
      return Response.notFound(req, res, "User not found");
    }

    /* find last password reset request for this user */
    const lastPasswordResetRequest = await this.passwordResetRepository.findLastByUserId(user.email);

    if (lastPasswordResetRequest !== null) {
      const tokenValidityService = new TokenValidityService(lastPasswordResetRequest);

      if (tokenValidityService.isAuthorizedToRequest() === false) {
        return Response.unprocessableEntity(req, res, "Password reset request already sent");
      }
    }

    const token = (new GenerateResetPasswordTokenService()).token;
    await this.passwordResetRepository.create({email, token});

    emailEvent.emit('send', new Email({
      to: email,
      subject: 'Password Reset',
      template: 'password/password-reset.html',
      context: {
        link: process.env.VITE_FRONT_URL + "/reset-password/" + token
      }
    }));

    return Response.ok(req, res, {
      message: "A reset password email has been sent to your email address"
    });
  };
}

export default new PasswordRequestController();
