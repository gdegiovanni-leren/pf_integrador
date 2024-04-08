import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    products: ref([]),
    users: ref([]),
    loading: false,
    //new product
    title: '',
    description: '',
    code: '',
    price: '',
    stock : '',
    category: '',
    //update product
    pidForUpdate: '',
    titleUpdate: '',
    descriptionUpdate: '',
    codeUpdate: '',
    priceUpdate: '',
    stockUpdate: '',
    categoryUpdate: '',
    images: [],
    //update user
    userpidForUpdate: '',
    userProfileNameForUpdate: '',
    userRoleForUpdate: ''
  }),

  actions: {

     async handleFileUpload(e) {
      this.images = []
      // debugger;
      console.log('call method handle files')
       console.log(e.target.files)

       const files = e.target.files
       if(files && files.length > 4){
        Swal.fire({
          title: 'Alert',
          text: 'Only a maximum of 5 images will be uploaded.',
          icon: 'warning',
          confirmButtonText: 'OK'
          });
       }
       if(files && files.length > 0){
        let count = 0;
        for (const image of files) {
          if( count < 5){
          this.images.push(image)
          }
          count++
        }
       }
       console.log(this.images)
       //Upload to server
   },

      async fetchAllUsers(){

        try{
          const URL = `${import.meta.env.VITE_BASE_URL}api/users`
          const response = await axios.get(URL);

          console.log(response)
          if(response.data?.data && response.data?.data.length > 0){
            console.log('store users found')
            this.users = response.data.data
            console.log(this.users)
          }

        }catch(err){
        console.log(err)
        }


    },

    async createNewProduct(){

      /*
       let product = {
        title: this.title,
        description: this.description,
        code: this.code,
        price: this.price,
        stock: this.stock,
        category: this.category,
        status: true,
        thumbnails: []
       }
       */

        let form = new FormData();
        form.append('title', this.title)
        form.append('description', this.description)
        form.append('code', this.code)
        form.append('price',this.price)
        form.append('stock',this.stock)
        form.append('category',this.category)
        form.append('status',1)

        //append images (max 5)
        for (let i=0; i<this.images.length; i++){
          if(i < 5){
          form.append('thumbnails', this.images[i])
          }
        }

        console.log('sending form',form)

       try{
          const URL = `${import.meta.env.VITE_BASE_URL}api/products`
          //const response = await axios.post(URL,product)
          const response = await axios.post(URL,form,{
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: form
            })

          if(response && response.data.status == true){
            this.title = '',
            this.description = '',
            this.code = '',
            this.price = '',
            this.stock = '',
            this.category = ''
            //refresh all products / TODO: refresh only the product that was modified
            this.getProducts()
          }

        return response.data
        }catch(e){
          console.log('create product fails')
          console.error(e)
        }
      return { status : false, message: 'Product creation error' }
    },


  async updateProduct(pid){

      if(pid === this.pidForUpdate){

        let productUpdate = {
          title: this.titleUpdate,
          description: this.descriptionUpdate,
          code: this.codeUpdate,
          price: this.priceUpdate,
          stock: this.stockUpdate,
          category: this.categoryUpdate,
          status: true,
          thumbnails: []
         }

         try{
          const URL = `${import.meta.env.VITE_BASE_URL}api/products/${pid}`
          const response = await axios.put(URL,productUpdate);

            if(response && response.data.status == true){
              this.pidForUpdate = ''
              this.titleUpdate = '',
              this.descriptionUpdate = '',
              this.codeUpdate = '',
              this.priceUpdate = '',
              this.stockUpdate = '',
              this.categoryUpdate = ''
               //refresh all products / TODO: refresh only the product that was modified
              this.getProducts()
            }
        return response.data;

        }catch(e){
          console.log('update products fails')
          console.error(e)
         //return data error message to view
         if(e.response.data) return e.response.data
        }
      }else{
        //the cache cart product pid not match with selected product, fatal error
        console.error('PIDS NOT MATCH ERROR')
      }
    //unknow error
    return { status : false, message: 'Product update error' }
  },


    async getProducts() {

      console.log('calling get products (admin)')
      try{
        const URL = `${import.meta.env.VITE_BASE_URL}api/products`
        const response = await axios.get(URL)
        this.products = await response.data
      }catch(e){
          console.log('request get all products fails')
          console.log(e)
      }
    },


    async getProductsFiltered(action){
      let page = 1
      if(action == 'NEXT'){
        page = this.products.nextPage
      }
      if(action == 'PREV'){
        page =  this.products.prevPage
      }
      const URL = `${import.meta.env.VITE_BASE_URL}api/products?page=${page}`
      const response = await axios.get(URL);
      this.products = await response.data;
    },


    async removeItem(pid){
      try{
          const URL = `${import.meta.env.VITE_BASE_URL}api/products/${pid}`
          const response = await axios.delete(URL);

          if(response && response.data.status == true){
            //refresh all products / TODO: refresh only the product that was modified
            this.getProducts()
          }
          return response.data

      }catch(e){
        console.error(e)
        //return data error message to view
        if(e.response.data) return e.response.data
      }
    //unknown error
    return {status: false, message: 'Delete product fail'}
    },



    async updateUser(uid){

      if(uid === this.userpidForUpdate){

        let userUpdate = {
          profile_name: this.userProfileNameForUpdate,
          role: this.userRoleForUpdate,
         }

         try{
          const URL = `${import.meta.env.VITE_BASE_URL}api/users/${uid}`
          const response = await axios.put(URL,userUpdate);
          console.log('RESPONSE UPDATE USER')
          console.log(response)


            if(response && response.data.isvalid == true){
              console.log('resposne is Valid!')
              this.userpidForUpdate = ''
              this.userProfileNameForUpdate = '',
              this.userRoleForUpdate = '',
               //refresh all users
              this.fetchAllUsers()
            }
        return response.data;


        }catch(e){
          console.log('update users fails')
          console.error(e)
         //return data error message to view
         if(e.response.data) return e.response.data
        }
      }else{
        //the cache cart product pid not match with selected product, fatal error
        console.error('PIDS NOT MATCH ERROR')
      }
    //unknow error
    return { isValid: false, status : false, message: 'User update error' }
  },


  async deleteAllUsers(){

    console.log('DELETE ALL USERS CALL')

       try{
        const URL = `${import.meta.env.VITE_BASE_URL}api/users`
        const response = await axios.delete(URL);
        console.log('RESPONSE DELETE ALL USERS')
        console.log(response)

      return response.data;

      }catch(e){
        console.log('delete all users fails')
        console.error(e)
       //return data error message to view
       if(e.response.data) return e.response.data
      }

},

async deleteUser(uid){

     try{
      const URL = `${import.meta.env.VITE_BASE_URL}api/users/${uid}`
      const response = await axios.delete(URL);
      console.log('RESPONSE DELETE ONE USERS with pid '+uid)
      console.log(response)

    return response.data;

    }catch(e){
      console.log('delete one users fails')
      console.error(e)
     //return data error message to view
     if(e.response.data) return e.response.data
    }

},



  },
});
