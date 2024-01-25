

import { productService } from '../services/indexService.js'

class ProductController {

constructor(){}


getProducts = async (req, res) => {

    console.log('get products call')

    const limit = parseInt(req.query?.limit ?? 10)
    const queryFilter = req.query?.query ?? null
    const category = req.query?.category ?? null
    const price = req.query?.price ?? null
    const availability = req.query?.availability ?? null
    const page = req.query.page ? req.query.page : 1

    const result = await productService.getProducts(limit,queryFilter,category,price,availability,page)

     res.status(200).json(result)
}


getProductById = async( req, res ) => {

 try{
  const { id } = req.params
  const product = await productService.getProductById(id)
  if(product) return res.status(200).json(product)
 }catch(e){
    console.log('error finding product')
 }
 return res.status(404).json({ error: "Product not found" })

}


createProduct = async (req,res) => {

        const { title, description, code, price, stock, status, category , thumbnails } = req.body
        try {
          let data = { title, description, code, price, stock, status , category, thumbnails  }
          const result = await productService.addProduct(data)
          //devuelvo 200 pero el code y el error para este caso estan en el json
          return res.status(200).json(result)

        }catch (error) {
          console.log(error)
        }

        return res.status(400).json({status: false, message: 'There was an error trying to create product'});

}


updateProduct = async (req ,res) => {

    const { pid } = req.params;
    const data = req.body

    if(!pid) return res.status(200).json({status: false, message: 'Product id not found ('+pid+') for update'})
      try{
         const result = await productService.updateProduct(pid,data)
         return res.status(200).json(result)
      }catch(e){
        console.log(e)
        return res.status(200).json({status: false, message: 'Error updating product with id ('+pid+') '})
      }

    }


  deleteProduct = async( req, res) => {

    const { id } = req.params

    if(!id) return res.status(404).json({ status: false, message: "Product ID not found" })

    const result = await productService.deleteProduct(id)
    result.status ?
          res.status(200).json(result) :
          res.status(404).json(result)
   }


   getComments = async (req, res) => {
    const {id} = req.params
    try{
      const comments = await productService.getComments(id)
      //console.log('comments found? ',comments)
      if(!comments){
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(comments)
    }catch(error){
    console.log(error);
    }

   }

   addNewComment = async (req ,res) => {
    const { id } = req.params;
     const {comment, username} = req.body
      try {
        const updatedProduct = await productService.addNewComment(id,comment,username)
        if (!updatedProduct) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json("Comment Added!")
      } catch (error) {
        console.log(error);
        res.status(404).json({ error: "error adding comment" });
      }

   }

}


export default ProductController