
import express from 'express'
import mongoose from 'mongoose'
import ProductModel from '../DAO/models/product.js'
import CartModel from '../DAO/models/cart.js'

const router = express.Router()

export default router

//NEW EMPTY CART
router.get("/", async (req, res) => {
  try {
    const cart = await CartModel.create({});
    res.json(cart._id);
  } catch (error) {
    console.log(error)
    res.json({ status: false, error: 'There was an error creating a new cart' });
  }
})

//GET CART WITH POPULATE PRODUCTS
router.get("/:cid", async (req, res) => {

  const { cid } = req.params
  try {
    const cart = await CartModel.findOne({_id: cid}).exec();
    return res.json({ status: true , cart : cart })
  } catch (error) {
    console.log(error)
    res.json({ status: false,  message : 'The specified cart could not be found' });
  }
})

//ADD NEW PRODUCT TO CART
router.post("/:cid/products/:pid", express.json() , async (req, res) => {

  const {cid , pid} = req.params
  let  quantity = req.body?.quantity ?? 1

  if(cid && pid){

    try{
          const p = await ProductModel.findById(pid).exec()

          if(!p) return res.json({ status: false ,  message : `Product not found with ID ${pid}`})

          if(p.stock < quantity) return res.json({ status: false ,  message : `Insufficient stock.`})

          let cart = await CartModel.findById(cid).lean().exec()

          if(!cart) return res.json({ status: false ,  message : `Error adding product to cart. Cart not found.`})

          const productOnCart = await cart.products.find(element => element.product._id == pid)

            if(productOnCart){

            console.log('PRODUCT FOUND IN CART, INCREMENTING QUANTITY...')

            productOnCart.quantity = ( parseInt(productOnCart.quantity) + parseInt(quantity) )

            await CartModel.updateOne({_id: cid }, cart )

            }else{
              console.log('PRODUCT NOT FOUND iN CART, ADDING PRODUCT...')

              cart.products.push({ product: pid, quantity: quantity })

              await CartModel.updateOne({_id: cid }, cart )
            }

          return res.json({ status: true ,  message : `Product successfully added!`})

    }catch(e){
        console.log(e)
    }

  }

 return res.json({ status: false ,  message : `The product could not be added to the cart.`})

})

// ADD QUANTITY
router.put("/:cid/products/:pid", express.json() , async (req, res) => {

  const {cid , pid} = req.params
  const  quantity  = req.body?.quantity ?? 1

  console.log(cid)
  console.log(pid)
  console.log(quantity)

  console.log('quantity: '+quantity)
  console.log('parse int:')
  console.log(parseInt(quantity))

  if(cid && pid && !isNaN(parseInt(quantity))){

    try{

        const p = await ProductModel.findById(pid).exec()

        if(!p) return res.json({ status: false ,  message : `Product not found with ID ${pid}`})

        if(p.stock < quantity) return res.json({ status: false ,  message : `Insufficient stock.`})

        let cart = await CartModel.findById(cid).lean().exec()

        if(!cart) return res.json({ status: false ,  message : `Error when increasing quantity in cart. Cart not found.`})

        const productOnCart = await cart.products.find(element => element.product._id == pid)

        if(productOnCart){

        console.log('product found on cart')

        //If the quantity is negative to decrease the product, always check that the final quantity is not negative.
        if((quantity < 0 && (productOnCart.quantity + quantity) < 0) ){
          console.error('overflow quantity')
          productOnCart.quantity = 0
        }else{
          productOnCart.quantity = ( parseInt(productOnCart.quantity) + parseInt(quantity) )
        }

          const result = await CartModel.updateOne({_id: cid }, cart )

          return res.json({ status: true ,  message : `Product updated successfully!`})
        }else{
          return res.json({ status: true ,  message : `Product not found in cart`})
        }

    }catch(e){
        console.log(e)
    }
  }

  return res.json({ status: false ,  message : `The product could not be updated.`})

})


router.put("/:cid", express.json() , async (req, res) => {

  const {cid } = req.params
  const  products  = req.body

  if(cid && Array.isArray(products)){

    try{

      let cart = await CartModel.findById(cid).lean().exec()

      if(!cart)  return res.json({ status: false ,  message : `The cart could not be updated. Cart with ${cid} not found`})

      cart.products = []

        for( let i = 0 ; i < products.length ; i++){

          if(products[i]._id && products[i].quantity ){

            const p = await ProductModel.findById(products[i]._id).exec()

            if(!p)  return res.json({ status: false ,  message : `The cart could not be updated. Product with ${products[i]._id} not found`})

            cart.products.push({ product: products[i]._id, quantity: products[i].quantity })
          }else{
            return res.json({ status: false ,  message : `The cart could not be updated.`})
          }
        }

    const result = await CartModel.updateOne({_id: cid }, cart )

    return res.json({ status: true ,  message : `Products successfully updated on cart`})

    }catch(e){
        console.log(e)
    }
  }

  return res.json({ status: false ,  message : `The cart could not be updated.`})

})


//DELETE ALL PRODUCTS IN CART
router.delete("/:cid", express.json() , async (req, res) => {

  const {cid } = req.params

  if(cid){
    try{
      let cart = await CartModel.findById(cid).lean().exec()

      cart.products = []

      const result = await CartModel.updateOne({_id: cid }, cart )

      return res.json({ status: true ,  message : `Products successfully removed`})

    }catch(e){
      console.log(e)
    }
  }

  return res.json({ status: false ,  message : `The products could not be removed from the cart.`})

})


 //DELETE SPECFICIC PRODUCT IN CART
 router.delete("/:cid/products/:pid", express.json() , async (req, res) => {

    const {cid , pid} = req.params

  if(cid && pid){

    try{

        const p = await ProductModel.findById(pid).exec()

        if(!p) return res.json({ status: false ,  message : `Product not found in cart with ID ${pid}`})

        let cart = await CartModel.findById(cid).lean().exec()

        if(!cart) return res.json({ status: false ,  message : `The operation failed. Cart not found.`})

        const productOnCart = await cart.products.find(element => element.product._id == pid)

        if(productOnCart){

         console.log('product found on cart to delete')

         cart.products = cart.products.filter(function(item) {
          return item.product._id != pid;
          })

          const result = await CartModel.updateOne({_id: cid }, cart )

          return res.json({ status: true ,  message : `Product successfully removed!`})
        }else{
          return res.json({ status: true ,  message : `The operation failed. Product not found in cart.`})
        }

    }catch(e){
        console.log(e)
        return res.json({ status: false ,  message : `The product could not be removed from the cart.`})
    }

  }

  return res.json({ status: false ,  message : `Could not remove product from cart.`})
})
