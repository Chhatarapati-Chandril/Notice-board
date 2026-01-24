export const JSON_LIMIT = "64kb"

export const BCRYPT_SALT_ROUNDS = 10;

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
}