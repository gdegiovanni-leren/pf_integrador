
import express from 'express'
import ProductModel from '../DAO/models/product.js'
import auth from '../middlewares/auth.js'
import mongoose from 'mongoose'
import ProductManager from '../DAO/managers/productManager.js'

const router = express.Router()

export default router


router.get("/", async (req, res) => {

  console.log('get products call')

  try {

    const limit = parseInt(req.query?.limit ?? 10)
    const queryFilter = req.query?.query ?? null
    const category = req.query?.category ?? null
    const price = req.query?.price ?? null
    const availability = req.query?.availability ?? null

    const page = req.query.page ? req.query.page : 1

    if(isNaN(parseInt(page)) || parseInt(page) <= 0 ){
      return res.json({ status: false, payload : [] , error: 'Error . Invalid page' });
    }

    console.log('PAGE '+req.query.page)
    console.log('LIMIT: '+req.query.limit)

    let options = {
      page,
      limit,
      lean: true,
    }

    let query = {}

    if(queryFilter){
      query["$or"] =  [
        { title: { '$regex': queryFilter, '$options': 'i' } },
        { description: { '$regex': queryFilter, '$options': 'i' } },
        { code: { '$regex': queryFilter, '$options': 'i' } }
        //TODO: ADD MORE FIELD FILTERS
       ]
    }

    if(category && category != 'All'){
      query["category"] = category
    }

    if(availability && availability != 'All'){
      if(availability === 'Stock'){
        query["stock"] = { $gt: 0  }
      }else{
        query["stock"] = { $lt: 1  }
      }
    }

    if(price && price != 'All'){

      switch (price){
        case 'Asc':
          console.log('priceasc: '+price)
          options.sort = { price: 1 }
        break;
        case 'Desc' :
          console.log('pricedesc: '+price)
          options.sort = { price: -1 }
        break;
        }
    }

  //console.log(query)
   console.log(options)

  const result = await ProductModel.paginate(query, options)

  let prevLink = null
  let nextLink = null

  if(result.prevPage){

    prevLink = `localhost:8080/api/products?page=${result.prevPage}`
    if(queryFilter){
      prevLink = prevLink+`&query=${queryFilter}`
    }
    if(limit){
      prevLink = prevLink+`&limit=${limit}`
    }
    if(category && category != 'All'){
      prevLink = prevLink+`&category=${category}`
    }
    if(availability && availability != 'All'){
      prevLink = prevLink+`&availability=${availability}`
    }
    if(price && price != 'All'){
      prevLink = prevLink+`&price=${price}`
    }
  }

  if(result.nextPage){

    nextLink = `localhost:8080/api/products?page=${result.nextPage}`
    if(queryFilter){
      nextLink = nextLink+`&query=${queryFilter}`
    }
    if(limit){
      nextLink = nextLink+`&limit=${limit}`
    }
    if(category && category != 'All'){
      nextLink = nextLink+`&category=${category}`
    }
    if(availability && availability != 'All'){
      nextLink = nextLink+`&availability=${availability}`
    }
    if(price && price != 'All'){
      nextLink = nextLink+`&price=${price}`
    }
  }

  result.payload = result.docs
  result.status = true
  delete result.docs

  result.prevLink = prevLink
  result.nextLink = nextLink

  //console.log(result)

  res.status(200).json(result)

  } catch (error) {
    console.log(error)
    res.json({ status: false, payload : [] , error: 'Products could not be obtained' })
  }
});



router.get("/:id", async (req,res) =>{
  const {id} = req.params

  try{
    const product =  await ProductModel.findById(id).lean().exec()

    if(!product){ return res.status(404).json({ error: "Product not found" }) }
    return res.json(product)
  }catch(error){
   console.log(error);
  }
  return res.status(404).json({ error: "Product not found" })
})



router.delete("/:id", async (req,res) =>{
  const {id} = req.params
  if(id){
    try{
      const PM = new ProductManager()
      const result = await PM.deleteProduct(id)
      console.log('product delete result: '+result)

      return res.status(200).json(result)
    }catch(error){
    console.log(error);
    }
  }else{
    return res.status(404).json({ status: false, message: "Product ID not found" })
  }
  return res.status(404).json({ status: false, message: "Internal error: Could not delete product" })
})



router.post("/", express.json() , async (req, res) => {

  const { title, description, code, price, stock, status, category , thumbnails } = req.body
  const PM = new ProductManager()

  try {
    let data = { title, description, code, price, stock, status , category, thumbnails  }
    const result = await PM.addProduct(data)
    console.log(result)

    if(result.status == true){
      return res.status(200).json({status: true, message: result.message})
    }else{
      //devuelvo 200 PERO con mensaje de error
      return res.status(200).json({status: false, message: result.message})
    }
  }catch (error) {
    console.log(error)
  }

  return res.status(400).json({status: false, message: 'There was an error trying to create product'});
})



router.put("/:pid", express.json(), async (req, res) => {

  const { pid } = req.params;
  const data = req.body

  if(pid){
    try{
      const PM = new ProductManager()
      const result = await PM.updateProduct(pid,data)

      if(result.status == true){
        return res.status(200).json({status: true, message: result.message})
      }else{
        //200 pero con error
        return res.status(200).json({status: false, message: result.message})
      }

    }catch(e){
      console.log(e)
      return res.status(200).json({status: false, message: 'Error updating product with id ('+pid+') '})
    }

  }else{
    //200 pero con mensaje de error
    return res.status(200).json({status: false, message: 'Product id not found ('+pid+') for update'})
  }
});



router.post("/:id/comments", express.json(), async (req, res) => {
  const { id } = req.params;
 const {comment, username} = req.body
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
      $push: { comments: { text: comment, user: username } },
    },{new: true});

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json("Comment Added!")
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log(error);
    console.log(req.body.comment);
  }
});


router.get("/:id/comments", async (req,res) =>{
  const {id} = req.params
  console.log('get product by id form comment: '+id)
  try{
    const comments = await ProductModel.findById(id, 'comments')
    console.log('comments found? ',comments)
    if(!comments){
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(comments)
  }catch(error){
   console.log(error);
  }
})