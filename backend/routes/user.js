const { Router } = require('express')
const { User, Account } = require('../db/db')
const z = require('zod')
const router = Router()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const AuthMiddleware = require('../middleware/middleware')
dotenv.config()
const signupSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
})

/*          SIGN UP          */
router.post('/signup', async (req, res) => {
  const { success } = signupSchema.safeParse(req.body)
  if (!success) {
    return res.status(411).json({
      message: 'Email already taken / Incorrect inputs',
    })
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  })

  if (existingUser) {
    return res.status(411).json({
      message: 'Email already taken/Incorrect inputs',
    })
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  })
  const userId = user._id

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  })
  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT
  )

  res.json({
    message: 'User created successfully',
    token: token,
  })
})

/*       SIGN IN        */
const LoginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
})
router.post('/login', async (req, res) => {
  const { success } = LoginSchema.safeParse(req.body)
  if (!success) {
    res.status(411).json({ msg: 'Input is not a String' })
  }

  const { username, password } = req.body

  const user = await User.findOne({ username, password })
  const userId = user._id

  if (user) {
    const token = jwt.sign({ userId }, process.env.JWT)
    res.status(200).json({
      msg: 'User successfully logged in!',
      token: token,
    })
  }
})

/*         UPDATE        */
const updateSchema = z.object({
  username: z.string().email().optional(),
  password: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
})
router.put('/', AuthMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body)

  if (!success) {
    res.status(411).json({ msg: 'error while updating' })
  }

  if (req.body.password.length < 5) {
    res.status(411).json({ msg: 'password too small...' })
    return
  }
  await User.updateOne({ _id: req.userId }, req.body)
  res.json('Updated info Successfully')
})

/*    GET    */
router.get('/bulk', AuthMiddleware, async (req, res) => {
  const filter = req.query.filter || ''

  const users = await User.find({
    $or: [{ firstname: { $regex: filter } }, { lastname: { $regex: filter } }],
  })

  res.status(200).json({
    user: users.map((user) => ({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      _id: user._id,
    })),
  })
})

module.exports = router
