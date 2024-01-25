
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

class UserService {

    constructor(dao){
      console.log('User Service initialization')
      this.userDAO = dao
    }

    register = async (username, password, confirmPassword ) => {

        console.log('calling register in user service')
        try{
        let user = await this.userDAO.findOne(username)
        if(user){
            return { isvalid: false , status : 400, message: "Username already exist"}
        }
        if(password !== confirmPassword){
            return { isvalid: false, status: 400, message: "Passwords do not match"}
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user = {username, password: hashedPassword,  role: await this.getRole(username,password) }
        const createdUser =  await this.userDAO.create(user)
        const token = jwt.sign({id: user._id, username: user.username, role: user.role }, config.jwt_secret_key, {expiresIn: "20m"} )

        return { isvalid: true, status: 200, username: user.username, token, role: user.role }

        }catch(e){
            console.log(e)
            return { isvalid: false, status: 500, message: 'Unknown error in registering user '}
        }
    }

    login = async (username, password) => {

        console.log('calling login in user service')
        try{
        let user = await this.userDAO.findOne(username)
        if(!user){
          return { isvalid : false, status : 400 , message: "Invalid user" }
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return{ isvalid : false , status: 400, message: "Invalid password" }
        }
        const token = jwt.sign({id: user._id, username: user.username, role : user.role}, config.jwt_secret_key, {expiresIn: "15m"} )
        return { isvalid : true, message: token, username: username, role: user.role }

        }catch(e){
            console.log(e)
            return { isvalid: false, status: 500, message: 'Unknown error in login user' }
        }
    }


    getRole = async (username,password) => {

        console.log('calling register validation role admin')
        if(config.admin_email === username && config.admin_password === password ){
           return 'admin'
        }
        return 'user'
    }


}

export default UserService
