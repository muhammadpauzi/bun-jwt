import jwt from "jsonwebtoken";

async function generateAccessToken(userId: number) {
    return await jwt.sign(
        {
            id: userId,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    );
}

async function generateRefreshToken(userId: number) {
    return await jwt.sign(
        {
            id: userId,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        // { expiresIn: process.env.REFRESH_TOKEN_EXPIRY! }
        { expiresIn: "7d" }
    );
}

export { generateAccessToken, generateRefreshToken };
