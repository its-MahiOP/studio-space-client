import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI as string);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        // The registration form enforces: uppercase, lowercase, 6+ characters.
        minPasswordLength: 6,
    },
    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID as string,
            clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET as string,
        },
    },
});
