import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/customError.js";

export const cookieOptions = {
    expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}


export const sigUp = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        throw new CustomError("Please add all fields", 400)
    }
    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new CustomError("User already exists", 400)
    }
    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJWTToken()
    user.password = undefined
    req.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        token,
        user,
    })
})