import PostgreDAO from "../../dao/postgre.dao.js";
import { UserAttributes } from "../../types/index.js";


export async function getUsers(userId: number | null) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const whereQuery: any = {};
    const selectQuery: (keyof UserAttributes)[] = ['id', 'email', 'fullname', 'role', 'active', 'createdAt', 'updatedAt'];
    if (userId) whereQuery['id'] = userId;

    const result = await postgreDAOInstance.getFromTable<UserAttributes>(
      "users",
      whereQuery,
      selectQuery
    );

    return result
  } catch (err) {
    throw err;
  }
}