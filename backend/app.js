
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import loginRouter from './routes/loginRouter.js'
import registerRouter from './routes/registerRouter.js'
import productsRouter from './routes/productsRouter.js'
import cartsRouter from './routes/cartsRouter.js'
import config from './config/config.js'


const corsOrigin ={
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionSuccessStatus:200
}
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsOrigin))

app.use('/login', loginRouter)
app.use('/register', registerRouter)

app.use('/api/products', productsRouter )
app.use('/api/carts', cartsRouter )


app.get('/health', (req,res) => {
  res.status(200).send('OK')
})


app.listen(config.port, () => console.log('Listening on port '+config.port))
