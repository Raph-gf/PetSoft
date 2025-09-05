import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async credentials => {
        const validatedCredentials = authSchema.safeParse(credentials);
        if (!validatedCredentials.success)
          return { message: "Invalid form data" };

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await getUserByEmail(String(credentials.email));
        if (!user) return null;

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.hashedPassword
        );
        if (!isValid) return null;
        console.log(user);

        return {
          id: user.id,
          email: user.email,
          hasAccess: user.hasAccess,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.hasAccess = (user as any).hasAccess ?? false;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session?.user && typeof token.userId === "string") {
        session.user.id = token.userId;
        session.user.hasAccess = token.hasAccess as boolean;
      }
      return session;
    },
  },
});
