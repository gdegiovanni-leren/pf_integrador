
import ProductModel from '../models/product.js'

class ProductManager {

    constructor(){}

    codeExists = async (code) => {
         const exists = await ProductModel.exists({code: code})
         return exists ? true : false
    }


    getProductById = async (id) => {

        const product = await ProductModel.findById(id).exec()

        return product ?
        { status: true ,  product : product , message : '' } :
        { status: false , product : null,  message : `Product not found with ID ${id}`}
    }


    getProducts = async () => {

        try{
            const products = await ProductModel.find().lean().exec()
            return products
        }catch(e){
            console.log(e)
        }
        return null
    }


    validateFields = async (data) => {

        if(!data) return {status : false, message : 'Error: No product data found' }

        const { title , description , code, price , status, stock, category , thumbnails } = data

        if(!title) return {status : false, message : 'The product must have a title' }
        if(!description) return {status : false, message : 'The product must have a description' }
        if(!code) return {status : false, message : 'The product must have a code' }
        if(!price) return {status : false, message : 'The product must have a price' }
        if(status != true && status != false) return {status : false, message : 'The product must have a status and must be true or false' }
        //if(!stock) return {status : false, message : 'El producto debe tener stock' }
        if(!category) return {status : false, message : 'The product must have a category' }
        if(stock < 0 || isNaN(parseInt(stock))) return {status : false, message : 'The stock entered is incorrect' }
        if(isNaN(parseFloat(price))) return {status : false, message : 'The price value is incorrect' }
        if(parseFloat(price) < 0 ) return {status : false, message : 'The price value is incorrect' }
        if(!Array.isArray(thumbnails)) return {status : false, message : 'Thumbnails must be in array format' }

        return {status : true, message : 'Validation success' }
    }


    addProduct =  async (data) => {

        try{
            let productsData = await this.validateFields(data)

            if(productsData.status != true) return {status: false, message : productsData.message }

            if(await this.codeExists(data.code)) return {status: false, message : `The product could not be added. The entered code already exists` }

            const p = {
                title : data.title.trim(),
                description : data.description.trim(),
                code: data.code,
                price : parseFloat(data.price),
                status: true, //true por default
                stock: parseInt(data.stock),
                category : data.category.trim(),
                thumbnails : data.thumbnails
            }

            const result = await ProductModel.create(p)

            if(result){
                return {status : true , message : 'Product successfully added!'}
            }else{
                return {status : false , message : 'Product could not be created'}
            }

        }catch(e){
          console.log(e)
          return {status : false , message : 'There was an error creating the product'}
        }
    }


    updateProduct = async (id,data) => {

        console.log('update product data received')
        console.log(data)
        try{

            if(!data.title) return {status: false, message: 'the title cannot be empty'}
            if(!data.description) return {status: false, message: 'the description cannot be empty'}
            if(!data.code) return {status: false, message: 'the code cannot be empty'}
            if(!data.price) return {status: false, message: 'the price cannot be empty'}
            //if(!data.stock) return {status: false, message: 'the stock cannot be empty'}
            if(data.stock < 0 || isNaN(parseInt(data.stock))) return {status : false, message : 'The stock entered is incorrect' }
            if(isNaN(parseFloat(data.price))) return {status : false, message : 'The price value is incorrect' }
            if(parseFloat(data.price) < 0 ) return {status : false, message : 'The price value is incorrect' }
            if(!Array.isArray(data.thumbnails)) return {status : false, message : 'Thumbnails must be in array format' }

            //validation code
            const codeExists =await ProductModel.findOne({code: data.code})
            console.log(codeExists)
            if(codeExists &&  codeExists._id != id){
                return {status : false, message : 'The product code already exists' }
            }

            const result = await ProductModel.findByIdAndUpdate(
                { _id: id },
               {
                $set: {
                  title: data.title.trim(),
                  description: data.description.trim(),
                  code: data.code.trim(),
                  price: parseFloat(data.price),
                  stock: !isNaN(parseInt(data.stock)) ? parseInt(data.stock) : 0,
                  category: data.category.trim()
                }
              },
            { runValidators: true },
            {new: true},
                (err) => {
                  if (err) {
                    console.error(err);
                  }
                }
              )

              //console.log('result after update:')
              //console.log(result)

          return {status : true , message : 'Update done successfully!'}

        }catch(e){
            console.log(e)
        }
        return {status : false , message : 'There was an error in product update.'}
    }



  deleteProduct = async(id) => {

    try{
        let exists = await this.getProductById(id)

        if(exists.status == false){
            return {status : false , message : 'No product found to remove'}
        }else{
            const result = await ProductModel.deleteOne({ _id: id })

            if(result){
                return {status : true , message : 'Product successfully removed!'}
            }else{
                return {status : false , message : 'No product found to remove'}
            }
        }
    }catch(e){
      console.log(e)
    }
    return {status : false , message : 'Error: Product could not be deleted'}
   }


}


export default ProductManager