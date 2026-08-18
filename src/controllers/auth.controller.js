import { where } from "sequelize";
import { default as db } from "../models/index.cjs";
import bcrypt from "bcrypt";
import { constants } from "node:http2";
const { Users } = db;

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email, password are required",
      });
    }
    const existing = await Users.findOne({ where: { email } });
    if (existing) {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      email,
      password: hashedPassword,
    });
    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Registered successfully",
      results: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email or Password required",
      });
    }
    const user = await Users.scope("withPassword").findOne({
      where: { email },
    });
    if (!user) {
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Incorrect password",
      });
    }
    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Login Successfully",
      result: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
}
