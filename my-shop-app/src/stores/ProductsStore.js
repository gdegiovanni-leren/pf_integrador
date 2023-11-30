import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: ref([]),
    loading: false,
    comments: ref([{}]),
    productsOnCart: ref([]),
    selectedBrand: "All",
    selectedGender: "All",
    selectedPrice: "All",
    selectedType: "All",

    selectedCategory: "All",
    selectedAvailability : "All",
    selectedLimit : 10,
    query : '',
    cart_id : '',
    go_to: '',
  }),


  actions: {

    //generate new cart or get cart id from local storage
    async getCart(){

      console.log('call get cart!')

      if(!localStorage.getItem('cart_id') || localStorage.getItem('cart_id') == ''){

        console.log('NO CART ID COOKIE FOUND')
        //new cart ID
        const URL = `${import.meta.env.VITE_BASE_URL}api/carts`;
        const response = await axios.get(URL);
        this.cart_id = await response.data;

        localStorage.setItem('cart_id', response.data)

      }else{

        console.log('CART ID COOKIE FOUND')
        this.cart_id =  localStorage.getItem('cart_id')
        //get Cart ID from localstorage
        const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${this.cart_id}`;
        const response = await axios.get(URL);
            if(response.data.status == true){
              console.log(response.data.cart)
              let cartWithProducts = response.data.cart.products ? response.data.cart.products : []

              for(let i = 0 ; i < cartWithProducts.length ; i++){

                let a = {
                  ...cartWithProducts[i].product,
                  quantity:  cartWithProducts[i].quantity
                }
                this.productsOnCart.push(a)
              }

            }else{
              console.error(response)
            }
      }
      console.log(this.cart_id)
    },


    //get all products, no filters
    async getProducts() {

      console.log('CALLING GET PRODUCTS...')
      try{
      this.loading = true;
      const URL = `${import.meta.env.VITE_BASE_URL}api/products`;
      const response = await axios.get(URL);
      this.products = await response.data;
      this.loading = false;
      }catch(e){
        console.log(e)
        this.loading = false;
      }
    },

    //get products with aplied filters
    async getProductsFiltered(action){

      let page = 1
      if(action == 'NEXT'){
        page = this.products.nextPage
      }
      if(action == 'PREV'){
        page =  this.products.prevPage
      }
      const URL = `${import.meta.env.VITE_BASE_URL}api/products?category=${this.selectedCategory}&price=${this.selectedPrice}&availability=${this.selectedAvailability}&query=${this.query}&page=${page}&limit=${this.selectedLimit}`
      const response = await axios.get(URL);
      this.products = await response.data;
    },


    //request to get specific page plus filters
    async goToPage(page){

      if(!page || isNaN(parseInt(page)) || parseInt(page) <= 0 || (parseInt(page) > this.products.totalPages)){
        this.go_to = ''
        alert('invalid page')
        return false;
      }else{
        const URL = `${import.meta.env.VITE_BASE_URL}api/products?category=${this.selectedCategory}&price=${this.selectedPrice}&availability=${this.selectedAvailability}&query=${this.query}&page=${this.go_to}&limit=${this.selectedLimit}`
        const response = await axios.get(URL);
        this.products = await response.data;

        return true;
      }
    },

    //get single product
    async  getProduct(_id) {

      try{
        const URL = `${import.meta.env.VITE_BASE_URL}api/products/${_id}`
        const response = await axios.get(URL);
        return await response.data;
      }catch(e){
          console.error(e)
          //TODO: REDIRECT 404 PAGE
      }
      return null
  },

    //add specific product to cart
    async addToCart(_pid) {
      console.log(_pid)

      const product = this.products.payload.find((element) => element._id === _pid)

      if(product){

        if(product.stock <= 0){
          this.showMessageError = true
          this.messageError = 'Could not add product to cart. Out of stock!'
        }

          const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${this.cart_id}/products/${_pid}`
          const response = await axios.post(URL, {
          quantity: '1'
          })

          if(response.data && response.data.status == true){

            console.log('product found to be added to cart')

            const Alreadyexists = this.productsOnCart.find((element) => element._id === _pid)

            if(Alreadyexists){
              console.log('Already in cart, incrementing quantity...')
              Alreadyexists.quantity++
              console.log( Alreadyexists.quantity)
            }else{
              console.log('not product found in cart, including...')
              product.quantity = 1
              this.productsOnCart.push(product);
            }

        }else{
          this.showMessageError = true
          this.messageError = 'Could not add product to cart'
        }

    }else{
      alert('ERROR: PRODUCT NOT FOUND IN PRODUCTS LIST')
    }

    },

    //clear cart and generate new one
    async clearCart() {
      this.productsOnCart = [];
      this.cart_id = '';
      localStorage.removeItem('cart_id')
      //generate new cart id
      this.getCart()
    },


    //reset all filters and get all products
    async resetFilters(){

      this.selectedBrand = "All",
      this.selectedGender = "All",
      this.selectedPrice = "All",
      this.selectedType = "All",

      this.selectedCategory = "All",
      this.selectedAvailability = "All",
      this.selectedLimit = 10,
      this.query = '',

      this.getProducts()
    },

   //Coments for products
    async addComment(_productId, _comment, _username){
      try{
      const URL = `${import.meta.env.VITE_BASE_URL}products/${_productId}/comments`
      const response = await axios.post(URL, {
       text: _comment,
       user: _username
      })

      console.log(response);

    }
  catch(err){
    console.log(err);
  }

    },
    async getComments(productId) {
      const URL = `${import.meta.env.VITE_BASE_URL}products/${productId}/comments`;
      const response = await axios.get(URL);
      this.comments = await response.data.comments
      console.log(this.comments);
    },
  },
});
