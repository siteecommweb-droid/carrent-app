const passport = require("passport");

const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

const FacebookStrategy =
  require("passport-facebook").Strategy;

const db =
  require("./database");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        "http://localhost:4000/api/auth/google/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error("No email")
          );
        }

        const [existing] =
          await db.execute(
            `
            SELECT *
            FROM users
            WHERE email = ?
            LIMIT 1
          `,
            [email]
          );

        let user;

        if (existing.length > 0) {
          user = existing[0];
        } else {
          const [insert] =
            await db.execute(
              `
              INSERT INTO users
              (
                full_name,
                email,
                role,
                provider
              )
              VALUES (?, ?, ?, ?)
            `,
              [
                profile.displayName,
                email,
                "user",
                "google",
              ]
            );

          const [created] =
            await db.execute(
              `
              SELECT *
              FROM users
              WHERE id = ?
            `,
              [insert.insertId]
            );

          user = created[0];
        }

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

if (
  process.env.FACEBOOK_APP_ID &&
  process.env.FACEBOOK_APP_SECRET
) {
  passport.use(
    new FacebookStrategy(
      {
        clientID:
          process.env.FACEBOOK_APP_ID,

        clientSecret:
          process.env.FACEBOOK_APP_SECRET,

        callbackURL:
          "http://localhost:4000/api/auth/facebook/callback",

        profileFields: [
          "id",
          "displayName",
          "emails",
        ],
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value ||
            `facebook_${profile.id}@am38.com`;

          const [existing] =
            await db.execute(
              `
              SELECT *
              FROM users
              WHERE email = ?
              LIMIT 1
            `,
              [email]
            );

          let user;

          if (existing.length > 0) {
            user = existing[0];
          } else {
            const [insert] =
              await db.execute(
                `
                INSERT INTO users
                (
                  full_name,
                  email,
                  role,
                  provider
                )
                VALUES (?, ?, ?, ?)
              `,
                [
                  profile.displayName,
                  email,
                  "user",
                  "facebook",
                ]
              );

            const [created] =
              await db.execute(
                `
                SELECT *
                FROM users
                WHERE id = ?
              `,
                [insert.insertId]
              );

            user = created[0];
          }

          return done(null, user);

        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

module.exports = passport;