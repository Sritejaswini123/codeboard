import { auth } from "@/lib/auth";
export async function verifyUserPassword(email, password) {
    const ctx = await auth.$context;
    const account = await ctx.internalAdapter.getAccount("credential", email);
    if (!account || !account.password)
        throw new Error("Invalid credentials");
    const isValid = await ctx.password.verify(password, account.password);
    if (!isValid)
        throw new Error("Invalid credentials");
    const user = await ctx.internalAdapter.getUser(account.userId);
    if (!user.emailVerified)
        throw new Error("Email not verified");
    return user;
}
