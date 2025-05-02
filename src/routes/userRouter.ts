import express from "express";
import { prisma } from "../seed";

const userRouter = express.Router();

userRouter.get("/login", (req, res) => {
  res.render("user/login", { title: "login", error: null });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });
    const passwordMatch = foundUser?.password === password;

    if (!foundUser || !passwordMatch) {
      return res.render("user/login", {
        title: "login",
        error: "Invalid username or password",
      });
    } else {
      // need to add session
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/logout", (req, res) => {
  // need to delete session
  res.redirect("/login");
});

userRouter.get("/register", (req, res) => {
  res.render("user/register", { title: "register", error: null });
});

export { userRouter };
