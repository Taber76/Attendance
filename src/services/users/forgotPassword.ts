import PostgreDAO from "../../dao/postgre.dao.js";
import { UserAttributes } from "../../types/index.js";
import { EmailHandler } from "../../handlers/email.handler.js";
import { UserHelper } from "../../helpers/user.helper.js";
import MemoryStorage from "../../storage/memory.storage.js";

export async function forgotPassword(user: { email: string }) {
  try {
    const { email } = user;
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const existingUser = await postgreDAOInstance.getFromTable<UserAttributes>(
      "users",
      { email: user.email }
    );
    if (existingUser.length === 0) throw new Error("User not found");
    const verificationCode = UserHelper.createCode();

    MemoryStorage.addVerificationCode(email, verificationCode);
    const emailSent = await EmailHandler.sendForgotPasswordEmail(
      email,
      verificationCode
    )
    if (!emailSent) throw new Error("Unable to send verification email");

    return { ...existingUser[0], password: null }
  } catch (err) {
    throw err;
  }
}