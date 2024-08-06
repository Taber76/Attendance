import PostgreDAO from "../../dao/postgre.dao.js";
import { UserUpdateAttributes } from "../../types/index.js";

export async function updateUser(userData: UserUpdateAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const usersUpdated = await postgreDAOInstance.updateTable<UserUpdateAttributes>(
      'users',
      userData,
      { id: userData.id }
    )
    if (usersUpdated > 0) {
      return true;
    }
    throw new Error('User not updated');
  } catch (err) {
    throw err;
  }
}