import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import { sendEmail } from "../middleware/email";
const prisma = new PrismaClient();

dotenv.config();

const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  res.render("auth/login", { title: "login", error: null });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!foundUser || !foundUser.password) {
      return res.render("auth/login", {
        title: "login",
        error: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.render("auth/login", {
        title: "login",
        error: "Invalid username or password",
      });
    } else {
      req.session.user = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };

      console.log("login complete");
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).send("Logout failed.");
    }

    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
});

authRouter.get("/register", (req, res) => {
  res.render("auth/register", { title: "register", error: null });
});

authRouter.post("/register", async (req, res) => {
  let { email, name, password } = req.body;

  email = email.trim();
  name = name.trim();
  password = password.trim();

  if (!email || !name || !password) {
    return res.render("auth/register", {
      title: "register",
      error: "All fields are required. Please fill in all details.",
    });
  }

  try {
    console.log(req.body);
    const hashed = await bcrypt.hash(password, 10);

    const userWithSameEmailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userWithSameEmailExists) {
      // return res.redirect("/auth/register");
      return res.render("auth/register", {
        title: "register",
        error: "That email has already been taken. Please try another one",
      });
    } else {
      const createUser = await prisma.user.create({
        data: {
          email,
          name: name,
          password: hashed,
        },
      });
      console.log("New user created:", createUser);

      req.session.user = {
        id: createUser.id,
        name: createUser.name,
        email: createUser.email,
      };

      res.redirect("/profilephoto");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

authRouter.get("/check-email", async (req, res) => {
  const { email } = req.query;

  try {
    if (!email || email.length === 0) {
      res.status(400).json({ error: "Email cannot be empty" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    if (user) {
      res.json({ exists: true });
      return;
    } else {
      res.json({ exists: false });
      return;
    }
  } catch (err) {
    console.error("Error in email check:", err);
    res.status(500).json({ error: "Server error" });
  }
});

authRouter.get("/forgot-password", (req, res) => {
  res.render("auth/forgot-password", { title: "forgot-password", error: null });
});

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.render("auth/forgot-password", {
        title: "forgot-password",
        error: "Invalid Email address",
      });
    } else {
      const now = new Date();
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const code = Math.floor(10000 + Math.random() * 90000);
      console.log("password reset code:" + code);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetCode: String(code), // random 5 digit
          passwordResetCodeExpirations: oneDayLater,
        },
      });
      try {
        const html = `
          <p>Hello ${user.name || "user"},</p>
          <p>You requested a password reset for your LendItOut account.</p>
          <p>Your verification code is:</p>
          <h2>${code}</h2>
          <p>This code will expire in 24 hours.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        `;

        await sendEmail(email, "LendItOut Password Reset Code", html);
      } catch (err) {
        console.error("Email sending failed:", err);
        return res.render("auth/forgot-password", {
          title: "forgot",
          error: "Failed to send email. Try again later.",
        });
      }

      res.render("auth/forgot-password-validation", {
        title: "forgot-password",
        email: email,
        error: null,
      });
    }
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).send("Internal Server Error");
  }
});

authRouter.post("/forgot-password-validation", async (req, res) => {
  try {
    const { email } = req.body;
    const code =
      (req.body["code_0"] || "") +
      (req.body["code_1"] || "") +
      (req.body["code_2"] || "") +
      (req.body["code_3"] || "") +
      (req.body["code_4"] || "");
    console.log(email);
    console.log(code);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // render errors
      res.render("auth/forgot-password", {
        title: "forgot-password",
        error: "Invalid Email address",
      });
    } else {
      if (
        user.passwordResetCodeExpirations &&
        new Date() < user.passwordResetCodeExpirations
      ) {
        if (user.passwordResetCode == code) {
          res.render("auth/password-reset", {
            title: "forgot",
            email,
            code,
            error: null,
          });
        } else {
          res.render("auth/forgot-password-validation", {
            title: "forgot",
            error: "Invalid code number",
          });
          //render wrong code error
        }
      } else {
        res.render("auth/forgot-password-validation", {
          title: "forgot",
          error: "Invalid code number",
        });
        //render code expiration error
      }
    }
  } catch (err) {
    console.error("Error in password validation:", err);
    res.status(500).send("Internal Server Error");
  }
});

authRouter.post("/password-reset", async (req, res) => {
  try {
    const { password, email, code } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // render errors
      res.render("auth/forgot-password", {
        title: "forgot-password",
        error: "Invalid Email address",
      });
    } else {
      if (
        user.passwordResetCodeExpirations &&
        new Date() < user.passwordResetCodeExpirations
      ) {
        if (user.passwordResetCode == code) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              password: await bcrypt.hash(password, 10),
            },
          });
          req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          res.redirect("/auth/login");
        } else {
          res.render("auth/forgot-password", {
            title: "forgot",
            error: "password-reset is failed",
          });
        }
      } else {
        res.render("auth/forgot-password", {
          title: "forgot",
          error: "password-reset is failed",
        });
      }
    }
  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).send("Internal Server Error");
  }
});

export { authRouter };
