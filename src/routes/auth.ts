import { Hono } from "hono";
import { z } from "zod";
// import { sign, verify, jwt } from "hono/jwt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import prisma from "../prisma";
import { generateAccessToken, generateRefreshToken } from "../jwt";
import { protectedJwt } from "../middlewares";
import { Variables } from "hono/types";

const authRoutes = new Hono<{ Variables: Variables }>();

authRoutes.post("/login", async (c) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    const parsed = schema.safeParse(await c.req.parseBody());

    if (!parsed.success) {
        return c.json({
            success: false,
            errors: parsed.error.flatten(),
        });
    }

    const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
    });

    if (!user) {
        return c.json(
            { success: false, message: "Invalid email or password!" },
            401
        );
    }

    if (
        !(await Bun.password.verify(
            parsed.data.password,
            user.password,
            "bcrypt"
        ))
    ) {
        return c.json(
            { success: false, message: "Invalid email or password!" },
            401
        );
    }

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    return c.json({
        success: true,
        access_token: accessToken,
        refresh_token: refreshToken,
    });
});

authRoutes.post("/refresh", async (c) => {
    const { refresh_token: refreshToken } = await c.req.json();

    if (!refreshToken)
        return c.json(
            { success: false, message: "Missing refresh token" },
            401
        );

    try {
        const { id }: any = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        );

        // TODO: make sure user id exists on db

        const newAccessToken = await generateAccessToken(id);

        return c.json({ accessToken: newAccessToken }, 200);
    } catch (error) {
        console.error(error);
        if (error instanceof TokenExpiredError) {
            return c.json(
                { success: false, message: "Refresh token expired" },
                401
            );
        }

        return c.json(
            { success: false, message: "Invalid refresh token" },
            500
        );
    }
});

authRoutes.get("/user", protectedJwt, async (c) => {
    const { password, refresh_token, ...user } = await prisma.user.findUnique({
        where: { id: c.get("userId") as number },
    });

    return c.json({ success: true, data: user });
});

export default authRoutes;
