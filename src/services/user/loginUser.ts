import PostgreDAO from "../../dao/postgre.dao";
import { UserAttributes, UserCreationAttributes } from "../../types";
import { EmailHandler } from "../../handlers/email.handler";
import { UserHelper } from "../../helpers/user.helper";
import MemoryStorage from "../../storage/memory.storage";

export async function loginUser(user: Partial<UserAttributes>) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const result = await postgreDAOInstance.getFromTable<UserAttributes>(
      "users",
      { email: user.email, active: true }
    );
    if (result.length === 0) throw new Error("Password or email incorrect");


    return;
  } catch (err) {
    throw err;
  }
}