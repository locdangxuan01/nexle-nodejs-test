import { expressjwt as jwt } from "express-jwt";

export const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "30 days",
    });
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error verify::`, err);
      } else {
        console.log(`Decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};
