import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { saveRefreshToken } from "../models/refreshToken.model.js";
import ApiError from "../utils/ApiError.js";

export const issueTokens = async ({userId, role}) => {
    const payload = {userId, role}

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    const refreshTokenExpiryDays = process.env.REFRESH_TOKEN_EXPIRY_DAYS
    
    if (!refreshTokenExpiryDays) {
        throw new ApiError(400, "REFRESH_TOKEN_EXPIRY_DAYS is not set")
    }

    const expiresAt = new Date(
        Date.now() + refreshTokenExpiryDays * 24 * 60 * 60 * 1000
    )

    await saveRefreshToken({
        userId,
        userType: role,
        token: refreshToken,
        expiresAt
    })

    return {accessToken, refreshToken}
}