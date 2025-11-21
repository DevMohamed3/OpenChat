import passport from 'passport'
import { prisma } from '../config/prisma.js'
import DiscordStrategy from 'passport-discord'
import TwitterStrategy from 'passport-twitter'
import { generateToken } from '../utils/generateToken.js'

export function setupPassport() {

  function randomUsername(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

    // DISCORD STRATEGY
    passport.use(
        new DiscordStrategy(
            {
                clientID: process.env.DISCORD_CLIENT_ID!,
                clientSecret: process.env.DISCORD_CLIENT_SECRET!,
                callbackURL: 'http://localhost:4000/auth/discord/callback',
                scope: ['identify', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.email
                    if (!email) {
                        return done(
                            new Error('Discord did not return email'),
                            false
                        )
                    }

                    let user = await prisma.user.findUnique({
                        where: { email },
                    })

                    if (!user) {
                        const name = profile.global_name
                        const username = await randomUsername()

                        user = await prisma.user.create({
                            data: {
                                name,
                                email,
                                username,
                                password: '',
                            },
                        })
                    }

                    return done(null, user)
                } catch (error) {
                    console.error('DISCORD ERROR:', error)
                    return done(error, false)
                }
            }
        )
    )

    // TWITTER STRATEGY
    // passport.use(
    //   new TwitterStrategy(
    //     {
    //       consumerKey: process.env.TWITTER_KEY!,
    //       consumerSecret: process.env.TWITTER_SECRET!,
    //       callbackURL: "http://localhost:4000/auth/twitter/callback",
    //       includeEmail: true,
    //     },
    //     async (token, tokenSecret, profile, done) => {
    //       try {
    //         const email = profile.emails?.[0]?.value || null;

    //         if (!email) {
    //           return done(new Error("No email from Twitter"), null);
    //         }

    //         let user = await prisma.user.findUnique({
    //           where: { email },
    //         });

    //         if (!user) {
    //           user = await prisma.user.create({
    //             data: {
    //               name: profile.displayName,
    //               email,
    //               username: profile.username!,
    //               password: "",
    //             },
    //           });
    //         }

    //         return done(null, user);
    //       } catch (error) {
    //         return done(error, null);
    //       }
    //     }
    //   )
    // );

    // Passport session (not used but required)
    passport.serializeUser((user: any, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id: number, done) => {
        const user = await prisma.user.findUnique({ where: { id } })
        done(null, user)
    })
}
