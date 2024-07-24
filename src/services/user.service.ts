import PostgreDAO from "../dao/postgre.dao";
import { UserAttributes, UserCreationAttributes } from "../types";

export default class UserService {
  private static postgreDAO: PostgreDAO;

  private constructor() { }
  private static async init() {
    if (!UserService.postgreDAO) {
      UserService.postgreDAO = await PostgreDAO.getInstance();
    }
  }

  // -- Register a new user --
  public static async register(user: UserCreationAttributes) {
    try {
      await UserService.init();

      const existingUser = await UserService.postgreDAO.getFromTable<UserAttributes>(
        "users",
        { email: user.email }
      );
      if (existingUser.length > 0) throw new Error("User already exists");

      const result = await UserService.postgreDAO.insertIntoTable<UserCreationAttributes>(
        "users",
        user
      );

      // -- Send email verification
      if (!result) throw new Error("Unable to register user");



      return result;
    } catch (err) {
      throw err;
    }
  }


}
