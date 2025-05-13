import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import { prisma } from "../seed";
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
      req.session.userId = foundUser.id;
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
  const { email, name, password } = req.body;
  try {
    console.log(req.body);
    const hashed = await bcrypt.hash(password, 10);

    const userWithSameEmailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userWithSameEmailExists) {
      return res.redirect("/auth/register");
    } else {
      const createUser = await prisma.user.create({
        data: {
          email,
          name: name,
          password: hashed,
        },
      });
      console.log("New user created:", createUser);

      req.session.userId = createUser.id;
      res.redirect("/profilephoto");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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
      // 1. send email(TODO)
      // try {
      //   await sendResetEmail(email, String(code));
      // } catch (err) {
      //   console.error("Email sending failed:", err);
      //   return res.render("auth/forgot-password", {
      //     title: "forgot",
      //     error: "Failed to send email. Try again later.",
      //   });
      // }

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
          req.session.userId = user.id;
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
