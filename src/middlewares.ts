import { Context, HonoRequest, Next } from "hono";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const protectedJwt = async (c: Context, next: Next) => {
    const bearerToken = c.req.header("Authorization");

    if (!bearerToken) {
        return c.json({ success: false, message: "No bearer token" }, 401);
    }

    const accessToken = bearerToken.split(" ")[1] ?? null;

    if (!accessToken) {
        return c.json({ success: false, message: "No access token" }, 401);
    }

    try {
        const { id }: any = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        );

        c.set("userId", id);

        await next();
    } catch (error) {
        console.error(error);

        if (error instanceof JsonWebTokenError) {
            return c.json(
                { success: false, message: "Invalid access token" },
                401
            );
        }

        if (error instanceof TokenExpiredError) {
            return c.json(
                { success: false, message: "Access token expired" },
                401
            );
        }

        return c.json(
            { success: false, message: "something wrong on server" },
            500
        );
    }
};

export { protectedJwt };
