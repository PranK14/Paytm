const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const URL = process.env.MONGO_URL

mongoose.connect(URL)

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLenght: 20,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    minLength: 3,
    maxLenght: 20,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    minLength: 3,
    maxLenght: 20,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
})

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
})

const Account = mongoose.model('Account', accountSchema)
const User = mongoose.model('User', UserSchema)

module.exports = {
  User,
  Account,
}
