
import mongoose from 'mongoose'


const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default : 0
                }
            },

        ],

        default: []
    }
}, { minimize: false })


cartSchema.pre('findOne', function() {
    this.populate('products.product')
})


const cartModel = mongoose.model('carts', cartSchema)

export default cartModel
