import { AuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
    pages: {
        signIn: "/",
        signOut: "/"
    },

    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
    },

    providers: [
        DiscordProvider({
            clientId: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,

            profile(profile) {
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }

                return {
                    id: profile.id,
                    name: profile.global_name || profile.username,
                    email: profile.email,
                    image: profile.image_url,
                }
            }
        })
    ]
}