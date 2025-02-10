import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter"

import GitLab from "@auth/core/providers/gitlab";
import Credentials from "next-auth/providers/credentials"

import { z } from "zod";

import { db_connection } from "@/drizzle/db-connection";
import { accounts, sessions, users, verification_tokens } from "@/drizzle/schemas/user";
import { user_registration_tokens } from "@/drizzle/schemas/user_registration_token";
import { roles } from "@/drizzle/schemas/role";

import { eq, and } from "drizzle-orm";

import * as bcrypt from "bcrypt";

import { decryptWithPrivateKey } from "@/lib/encryption";

export const authSchema = z.object({
    register: z.object({
        username: z.string(),
        name: z.string(),
        surname: z.string(),
        email: z.string(),
        password: z.string(),
        user_registration_token: z.string(),
    }).optional(),
    login: z.object({
        email: z.string(),
        password: z.string(),
        remember: z.boolean()
    }).optional(),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db_connection, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verification_tokens,
    }),
    providers: [
        GitLab({
            authorization: "https://git.voxelgames.eu/oauth/authorize?scope=read_user",
            clientId: process.env.AUTH_GITLAB_ID,
            clientSecret: process.env.AUTH_GITLAB_SECRET,
        }),
        Credentials({
            credentials: {
                register: {},
                login: {},
            },
            authorize: async (credentials) => {
                const { register, login } = await authSchema.parseAsync(credentials);

                if (!login && register) {
                    const tokenInfo = await db_connection
                        .select()
                        .from(user_registration_tokens)
                        .where(and(
                            eq(user_registration_tokens.token, register.user_registration_token),
                            eq(user_registration_tokens.is_used, false),
                        ))
                        .innerJoin(roles, eq(user_registration_tokens.user_role, roles.id));

                    if (tokenInfo.length === 0) {
                        throw new Error("Invalid registration token.");
                    }

                    const hashedPassword = hashPassword(decryptWithPrivateKey(register.password), (err: Error) => {
                        throw new Error(err.message);
                    });
                }

                let user = null

                // logic to verify if the user exists
                user = await getUserFromDb(credentials.email, pwHash)

                if (!user) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.")
                }

                // return user object with their profile data
                return user
            },
        })
    ],
});

export function hashPassword(password: string, errorCallback: (err: Error) => void): string {
    let out: string = "";

    bcrypt.genSalt(10, (err, salt) => {
        if (!err) {
            return bcrypt.hash(password, salt, (err, hash) => {
                if (!err) {
                    out = hash;
                } else {
                    errorCallback(err);
                }
            });
        } else {
            errorCallback(err);
        }
    });
    
    return out;
}

export function checkPassword(password: string, hashedPassword: string, errorCallback: (err: Error) => void): boolean {
    let out: boolean = false;

    bcrypt.compare(password, hashedPassword, (err, result) => {
        if (!err) {
            out = result;
        } else {
            errorCallback(err);
        }
    });

    return out;
}