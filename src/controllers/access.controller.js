import { CREATED, SuccessResponse } from "../core/success.response";
import AccessService from "../services/access.service";

class AccessController {
  signup = async (req, res) => {
    new CREATED({
      message: "Registered OK",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  signin = async (req, res) => {
    new SuccessResponse({
      message: "Registered OK",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    const { user } = req;
    console.log(user);
    new SuccessResponse({
      message: "logout success",
      metadata: await AccessService.signOut(user.id),
    }).send(res);
  };

  handleRefreshToken = async (req, res) => {
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handleRefreshToken(req.body),
    }).send(res);
  };
}
const accessController = new AccessController();

export default accessController;
