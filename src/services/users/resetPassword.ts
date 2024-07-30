import PostgreDAO from "../../dao/postgre.dao";
import { UserAttributes } from "../../types";
import MemoryStorage from "../../storage/memory.storage";

export async function resetPassword(user: { email: string, password: string, code: string }) {
  try {
    const { email, password, code } = user;
    const savedCode = MemoryStorage.getCodeWithEmail(email);
    if (savedCode === code) {
      const postgreDAOInstance = await PostgreDAO.getInstance();
      const result = await postgreDAOInstance.updateTable<Partial<UserAttributes>>(
        'users',
        { password },
        { email }
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