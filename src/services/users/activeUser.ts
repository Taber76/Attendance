import PostgreDAO from "../../dao/postgre.dao.js";
import { UserAttributes } from "../../types/index.js";
import MemoryStorage from "../../storage/memory.storage.js";

export async function activeUser(code: string) {
  try {
    const email = MemoryStorage.getEmailWithCode(code);
    if (email) {
      const postgreDAOInstance = await PostgreDAO.getInstance();
      const result = await postgreDAOInstance.updateTable<Partial<UserAttributes>>(
        'users',
        { active: true },
        { email: email }
      );
      if (result > 0) {
        MemoryStorage.deleteVerificationCode(email);
        return true
      }
    }
    throw new Error('User not found');
  } catch (err) {
    throw err;
  }
}