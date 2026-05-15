const bcrypt = require("bcryptjs")
const generateToken = require("../utils/generateToken")
const User = require("../models/User")
const { successResponse , errorResponse } = require("../utils/apiResponse")


const register = async (req, res) => {
  try {

    const { email, password } = req.body

    const existingUser = await User.findOne({
      email
    })

    if (existingUser) {
      errorResponse(res, 400, "User already exists")
      return
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    const user = await User.create({
      email,
      password: hashedPassword
    })

    const token = generateToken(user._id)

    successResponse(res, 201, "User registered successfully", {
      token
    })

  } catch (error) {
    errorResponse(res, 500, error.message)
  }
}

const login = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({
      email
    })

    if (!user) {
       errorResponse(res, 401, "Invalid credentials")
       return
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const token = generateToken(user._id)

    successResponse(res, 200, "Login successful", {
      token
    });
     

  } catch (error) {

     errorResponse(res, 500, error.message)
  }
}

module.exports = {
  register,
  login
}