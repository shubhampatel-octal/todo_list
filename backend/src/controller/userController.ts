import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface AuthRequest extends Request {
  userId: string;
}

const check = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthRequest;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ msg: "user not found" });
      return;
    }

    res.status(200).json({ msg: "Logged in", user });
    return;
  } catch (err) {
    console.log("Error Getting user");
    res.status(500).json({ msg: "Error Getting user" });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res
        .status(403)
        .json({ msg: "please Enter Username, email and password" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ msg: "User already exists" });
      return;
    }

    if (password.length < 6) {
      res
        .status(403)
        .json({ msg: "Password must be at least 6 characters long" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET || "");

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ msg: "User created successfully", userId: user._id });
  } catch (err) {
    console.log("Error Signing up");
    res.status(500).json({ msg: "Error Signing up" });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(403)
        .json({ msg: "please Enter Username, email and password" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(409).json({ msg: "User not exists" });
      return;
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
      res.status(401).json({ msg: "Please Enter valid password" });
      return;
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWTSECRET || ""
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ msg: "User signin successfully", userId: existingUser._id });
  } catch (err) {
    console.log("Error Signing up");
    res.status(500).json({ msg: "Error Signing up" });
  }
};
const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.json({ msg: "Logged out" });
};

export { check, signup, signin, logout };
