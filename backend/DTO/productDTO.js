
export default class productDTO {


    constructor(product){
        this.title = product.title.trim(),
        this.description = product.description.trim(),
        this.code = product.code,
        this.price = parseFloat(product.price),
        this.status = true, //true por default
        this.stock = parseInt(product.stock),
        this.category = product.category.trim(),
        this.thumbnails = product.thumbnails
    }

}