
import express from 'express'

import CartController from '../controllers/cartController.js'
import  { auth , authorization }  from '../middlewares/auth.js'

const router = express.Router()

export default router

const cartController = new CartController()

router.get('/', auth, authorization('user'), cartController.createCart )
router.get("/:cid", auth, authorization('user'), cartController.getCart )
router.post("/:cid/products/:pid", auth, authorization('user'), cartController.addNewProduct )
router.put("/:cid/products/:pid" , auth, authorization('user'), cartController.addQuantity )
router.put("/:cid", auth, authorization('user'), cartController.updateCart )
router.delete("/:cid", auth, authorization('user'), cartController.deleteAllProducts )
router.delete("/:cid/products/:pid", auth, authorization('user'), cartController.deleteProduct )

router.post("/:cid/purchase", auth, authorization('user'), cartController.purchase )