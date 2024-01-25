
import express from 'express'
//hacer sockets para comments y sacar esto
import ProductModel from '../DAO/mongo/models/product.js'
import  { auth , authorization }  from '../middlewares/auth.js'
import ProductController from '../controllers/productController.js'

const router = express.Router()

export default router

const productController = new ProductController()

router.get('/',auth ,productController.getProducts)
router.get("/:id",auth, productController.getProductById)
router.post("/", auth , authorization('admin'), productController.createProduct)
router.delete("/:id",auth, authorization('admin'), productController.deleteProduct)
router.put("/:pid", auth, authorization('admin'), productController.updateProduct)

//TODO :  use sockets for handle comments (final version)
router.get("/:id/comments",auth, productController.getComments)
router.post("/:id/comments",auth, authorization('user'), productController.addNewComment)
