import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/Users";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Session callback to store correct user data in session
    async session({ session, token }) {
      // If the user is logged in via Google, use the database _id as userId
      if (session.user && session.user.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString(); // Save the MongoDB _id as userId
        }
      }
      return session;
    },

    // SignIn callback to handle Google login
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();

        console.log("Google login data:", user); // Debugging: log the user data

        // Check if the user exists in the database
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          console.log("Creating new user...");

          // Create a new user in the database
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            questions: null,
            questionAnswered: false,
          });

          console.log("New user created:", newUser.email); // Debugging: confirm new user creation
        }
      }

      return true; // Always return true to proceed with the sign-in
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };