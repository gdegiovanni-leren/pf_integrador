import { userService } from '../services/indexService.js'

class UserController {

    constructor(){}

    register = async(req, res) => {

            const {username, password, confirmPassword} = req.body
            const result = await userService.register(username,password,confirmPassword)
            if(result.isvalid){
                return res.status(200).json({username : result.username, token : result.token, role: result.role})
            }else{
                return res.status(result.status).json({message: result.message})
            }
    }

    login = async(req,res) => {

        const {username, password} = req.body
        const result = await userService.login(username,password)
        if(result.isvalid){
            return res.status(200).json({message: result.message, username : result.username , role : result.role })
        }else{
             return res.status(result.status).json({ message: result.message })
        }
    }

}


export default UserController