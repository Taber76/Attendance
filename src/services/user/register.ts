import PostgreDAO from "../../dao/postgre.dao";
import { UserAttributes, UserCreationAttributes } from "../../types";

export async function register(user: UserCreationAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const existingUser = await postgreDAOInstance.getFromTable<UserAttributes>(
      "users",
      { email: user.email }
    );
    if (existingUser.length > 0) throw new Error("User already exists");

    const result = await postgreDAOInstance.insertIntoTable<UserCreationAttributes>(
      "users",
      user
    );

    if (!result) throw new Error("Unable to register user");

    // -- Send email verification

    return result;
  } catch (err) {
    throw err;
  }
}