
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import loginRouter from './routes/loginRouter.js'
import registerRouter from './routes/registerRouter.js'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
import auth from './middlewares/auth.js'

const corsOrigin ={
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionSuccessStatus:200
}
dotenv.config()
const app = express();
app.use(cors(corsOrigin))

app.use('/login', loginRouter)
app.use('/register', registerRouter)

app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter )


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req,res) => {
  res.status(200).send('OK')
})

const port = process.env.PORT
app.listen(port, () =>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(console.log("Connected to database!"))
    .catch(err => console.log(err))
    console.log("Port listening on: ", port);
})
