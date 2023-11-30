
import express from 'express'
import User from '../DAO/models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

export default router

router.post("/", express.json(), async (req, res) =>{

    try {
      const {username, password} = req.body
      let user = await User.findOne({username})


      if(!user){
        return res.status(400).json({message: "Invalid user"})
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({message: "Invalid password"})
      }
      const token = jwt.sign({id: user._id, username: user.username}, process.env.SECRET_KEY, {expiresIn: "15m"} )
      return res.status(200).json({message: token, username})

    } catch (error) {
        console.log(error);
    }
})