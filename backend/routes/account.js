const express = require('express')
const { Account } = require('../db/db')
const { default: mongoose } = require('mongoose')
const AuthMiddleware = require('../middleware/middleware')

const router = express()

router.get('/balance', AuthMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  })

  if (!account) {
    return res.json({ msg: 'invalid account details' })
  }
  res.status(200).json({
    balance: account.balance,
  })
})

router.post('/transfer', AuthMiddleware, async (req, res) => {
  const session = await mongoose.startSession()

  session.startTransaction()
  const { to, amount } = req.body

  const fromAcc = await Account.findOne({
    userId: req.userId,
  }).session(session)

  if (!fromAcc || amount > fromAcc.balance) {
    await session.abortSession()
    return res.status(400).json({ msg: 'Insufficient Balance' })
  }

  const toAcc = await Account.findOne({
    userId: to,
  }).session(session)

  if (!toAcc) {
    await session.abortSession()
    return res.status(400).json({ msg: 'Invalid Account Details' })
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session)

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session)

  await session.commitTransaction()
  res.status(200).json({ msg: 'Money transfered Successfully!' })
})

module.exports = router
