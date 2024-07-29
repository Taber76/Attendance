import PostgreDAO from "../../dao/postgre.dao";
import { UserAttributes, UserCredentialsAttributes } from "../../types";
import { UserHelper } from "../../helpers/user.helper";
import MemoryStorage from "../../storage/memory.storage";

export async function loginUser(user: UserCredentialsAttributes) {
  try {
    const remainingLoginAttempts = MemoryStorage.addLoginAttempt(user.email);
    if (remainingLoginAttempts === -1) {
      throw new Error("Too many attempts. Please try again later.");
    }
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const result = await postgreDAOInstance.getFromTable<UserAttributes>(
      "users",
      { email: user.email, active: true }
    );
    if (result.length === 0) throw new Error("Password or email incorrect, login attempts remaining: " + remainingLoginAttempts);

    const passwordMatch = UserHelper.comparePassword(
      user.password,
      result[0].password
    );
    if (!passwordMatch) throw new Error("Password or email incorrect, login attempts remaining: " + remainingLoginAttempts);

    MemoryStorage.deleteLoginAttempts(user.email);
    const token = UserHelper.generateToken(result[0]);

    return { userData: { ...result[0], password: null }, token };
  } catch (err) {
    throw err;
  }
}