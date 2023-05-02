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

export const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new CustomError("Please fill all details", 400)
    }

    const user = User.findOne({email}).select("+password")
    if (!user) {
        throw new CustomError("Invalid credentials", 400)
    }

    const isPasswordMatched = await user.comparePassord(password)
    if (isPasswordMatched) {
        const token = user.getJWTToken()
        user.password = undefined
        req.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }
    throw new CustomError("Password is incorect", 400)
})

export const logout = asyncHandler(async(req, res) => {
    req.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})

export const getProfile = asyncHandler(async(req, res) => {
    const {user} = req
    if (!user) {
        throw new CustomError("User not found", 401)
    }

    res.status(200).json({
        success: true,
        user
    })
})