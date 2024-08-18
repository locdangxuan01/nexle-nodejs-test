require("dotenv").config();
import bcrypt, { hash } from "bcrypt";
import knex from "../dbs/init.mysql";
import {
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} from "../core/error.response";
import jwt from "jsonwebtoken";

class AccessService {
  static signUp = async ({ firstName, lastName, email, password }) => {
    // Check user exist
    const user = await knex("user").select("id").where({ email }).first();

    if (user) {
      throw new BadRequestError("User already exist");
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const [id] = await knex("user")
      .insert({
        firstName,
        lastName,
        email,
        hash: passwordHashed,
        updatedAt: new Date(),
      })
      .returning("id");

    return {
      id,
      firstName,
      lastName,
      email,
      displayName: `${firstName} ${lastName}`,
    };
  };

  static signIn = async ({ email, password }) => {
    const user = await knex("user")
      .select("id", "hash", "email", "firstName", "lastName")
      .where({ email })
      .first();
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      throw new BadRequestError("Invalid user");
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "30d" }
    );

    const dateNow = new Date();

    await knex("token").insert({
      userId: user.id,
      refreshToken,
      expiresIn: dateNow.setDate(dateNow.getDate() + 30),
    });

    return {
      user: { ...user, hash: undefined },
      token: accessToken,
      refreshToken,
    };
  };

  static signOut = async (userId) => {
    try {
      await knex("token").delete().where({ userId });
      return null;
    } catch (error) {
      throw error;
    }
  };

  static handleRefreshToken = async ({ refreshToken }) => {
    const existRefreshToken = await knex("token")
      .select("id", "userId")
      .where({ refreshToken })
      .first();

    if (!existRefreshToken) {
      throw new NotFoundError("Invalid refresh token");
    }

    const user = await knex("user")
      .select("id", "email")
      .where({ id: existRefreshToken.userId })
      .first();

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "30d" }
    );

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };
}

export default AccessService;
