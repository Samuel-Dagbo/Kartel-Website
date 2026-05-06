import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "@/app/models/User";

export async function getSessionUserRole() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthenticated");
  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");
  return { user };
}