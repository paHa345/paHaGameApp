export async function getUserType(userEmail: string): Promise<any> {
  const user = await fetch("./api/users/getUserByEmail");
  return user;
}
