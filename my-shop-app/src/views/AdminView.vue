<script setup>
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useAdminStore } from '../stores/AdminStore';
const store = useAdminStore()
let total = ref(0);
let newProductModal = ref(false)
let updateProductModal = ref(false)
let updateitem = false
let selectedProduct = null
let showMessageSuccess = ref(false)
let showMessageError = ref(false)
let showMessageErrorModal = ref(false)
let messageSuccess = ''
let messageError = ''
let messageErrorModal = ''

store.getProducts()

/*
for (let i = 0; i < store.products.length; i++) {
  console.log('find product from admin store')
}
*/

  async function modalUpdateItem(pid){

    selectedProduct = await store.products.payload.find(product => product._id == pid);

    if(selectedProduct){

    store.pidForUpdate = selectedProduct.id
    store.titleUpdate = selectedProduct.title
    store.descriptionUpdate = selectedProduct.description
    store.codeUpdate = selectedProduct.code
    store.categoryUpdate = selectedProduct.category
    store.priceUpdate = selectedProduct.price
    store.stockUpdate = selectedProduct.stock

    updateProductModal.value = true

    }else{
      messageError = 'Ups, product with '+pid+' not found for update!'
      showMessageError.value = true

    }
    /*
    store.productsOnCart = store.productsOnCart.filter(product => product._id != id)
    */
  }

  async function removeItem(pid){

   const result = await store.removeItem(pid)
   if(result.status == true){
     showMessageSuccess.value = true
     messageSuccess = result.message
    }else{
      showMessageError.value = true
      messageError = result.message
    }
  }

  async function updateProduct(pid){

    const result = await store.updateProduct(pid)
    if(result.status == true){
      updateProductModal.value = false
      showMessageSuccess.value = true
      messageSuccess = result.message
      showMessageError.value = false
      showMessageErrorModal.value = false
    }else{
      console.log(result.message)
      showMessageErrorModal.value = false
      messageErrorModal = result.message
      showMessageErrorModal.value = true
    }

  }

  async function createNewProduct(){
    const result = await store.createNewProduct()
    if(result.status == true){
      newProductModal.value = false
      showMessageSuccess.value = true
      messageSuccess = result.message
      showMessageError.value = false
      showMessageErrorModal.value = false
    }else{
      console.log(result.message)
      showMessageErrorModal.value = false
      messageErrorModal = result.message
      showMessageErrorModal.value = true
    }
  }


function onCloseMessageSuccess(){
  showMessageSuccess.value = false
  messageSuccess = ''
}

function onCloseMessageError(){
  showMessageError.value = false
  messageError = ''
}

function onCloseMessageErrorModal(){
  showMessageErrorModal.value = false
  messageErrorModal = ''
}

function onCloseModal(){
  newProductModal.value = false
  updateProductModal.value = false
  //delete if already has message error
  showMessageError.value = false
  showMessageErrorModal.value = false
  messageErrorModal  = ''
  messageError = ''
}

</script>


<template>
<Navbar></Navbar>

  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col lg:flex-row lg:justify-between">
      <div class="w-full lg:w-3/3">
        <div class="flex flex-col mt-8">
          <div class="flex justify-between">
            <h2 class="text-lg font-medium leading-6 text-gray-900">Product List</h2>
            <button @click="newProductModal = !newProductModal"
            class="mt-4 bg-gray-800 p-4 text-white text-center py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50">
              NEW PRODUCT
            </button>
          </div>

      <!-- messages error/success -->
        <Transition name="fade"  :duration="{ enter: '1000', leave: '2000' }">
          <div class="flex  mt-2 mb-2 custom-success" v-if="showMessageSuccess" >
            <div style="width:95%;text-align:center;text-transform:uppercase;" class="mt-2 mb-2" >{{ messageSuccess }}</div>
            <button style="width:5%" class="" @click="onCloseMessageSuccess">X</button>
        </div>
       </Transition>
       <Transition name="fade"  :duration="{ enter: '1000', leave: '2000' }">
          <div class="flex  mt-2 mb-2 custom-error" v-if="showMessageError" >
            <div style="width:90%;text-align:center" class="mt-2 mb-2" >{{ messageError }}</div>
            <button style="width:10%" class="" @click="onCloseMessageError" >X</button>
        </div>
       </Transition>

          <div class="flex-1 mt-4">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Product
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Code
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Description
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Price
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Category
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Stock
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in store.products.payload">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img class="w-full h-full object-contain rounded-md" :src="product.thumbnails" alt="">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{product.title}}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{product.code}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{product.description}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{product.price}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{product.category}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{product.stock}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div style="justify-content: space-evenly;" class="flex">
                        <button class="text-gray-500 hover:text-gray-700" @click="modalUpdateItem(product._id)" aria-label="Update item">

                       <svg class="w-4 h-4 fill-current" enable-background="new 0 0 128 128" height="20px" id="Layer_1" version="1.1" viewBox="0 0 128 128" width="128px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M18.233,81.666l-0.016,0.003c0.006,0.012,0.01,0.022,0.016,0.036c0.008,0.101,0.026,0.195,0.04,0.293   c0.002,0.017,0,0.029,0.002,0.045l3.929,25.514c0.476,3.098,3.374,5.221,6.47,4.743c3.098-0.476,5.222-3.372,4.746-6.471   l-0.611-3.965c0.712,0.587,1.43,1.169,2.175,1.714c10.106,7.42,23.111,10.987,36.486,8.926c13.372-2.056,24.702-9.37,32.109-19.487   c3.662-4.988,6.353-10.695,7.922-16.793l-15.479-4.262c-1.044,4.191-2.882,8.109-5.405,11.552   c-5.012,6.824-12.566,11.713-21.593,13.105c-9.027,1.388-17.705-1.002-24.536-6.004c-0.841-0.616-1.645-1.282-2.424-1.976   l4.488,0.435c2.872,0.276,5.445-2.025,5.748-5.144c0.3-3.12-1.783-5.873-4.655-6.15l-23.659-2.291   c-2.568-0.248-4.884,1.572-5.564,4.188c-0.05,0.185-0.076,0.374-0.109,0.565c-0.021,0.132-0.061,0.255-0.074,0.39   c-0.004,0.041,0.002,0.077-0.001,0.114c-0.013,0.174-0.004,0.351-0.002,0.528C18.235,81.406,18.224,81.539,18.233,81.666z" fill="#232323"/><path d="M109.767,46.334l0.015-0.002c-0.006-0.013-0.01-0.024-0.016-0.037c-0.008-0.1-0.027-0.195-0.04-0.293   c-0.002-0.015,0-0.029-0.002-0.044l-3.928-25.513c-0.477-3.097-3.373-5.221-6.472-4.744c-3.097,0.477-5.221,3.373-4.744,6.47   l0.612,3.967c-0.715-0.587-1.433-1.169-2.177-1.715c-10.106-7.419-23.112-10.989-36.484-8.926   c-13.374,2.055-24.703,9.371-32.109,19.487c-3.664,4.989-6.355,10.696-7.922,16.794l15.479,4.26   c1.042-4.19,2.882-8.108,5.403-11.551c5.012-6.824,12.569-11.712,21.595-13.105c9.027-1.386,17.703,1.002,24.536,6.002   c0.841,0.618,1.645,1.284,2.423,1.976l-4.487-0.434c-2.872-0.278-5.445,2.026-5.747,5.144c-0.303,3.119,1.782,5.873,4.653,6.15   l23.659,2.291c2.568,0.248,4.884-1.572,5.564-4.188c0.05-0.184,0.076-0.374,0.107-0.565c0.022-0.132,0.063-0.255,0.075-0.391   c0.006-0.038-0.003-0.075,0-0.112c0.014-0.175,0.007-0.353,0.003-0.53C109.764,46.595,109.774,46.462,109.767,46.334z" fill="#232323"/></g></svg>
                      </button>
                      <button class="text-gray-500 hover:text-gray-700" @click="removeItem(product._id)" aria-label="Remove item">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.3 6.3a1 1 0 011.4 0L10 8.6l2.3-2.3a1 1 0 011.4 1.4L11.4 10l2.3 2.3a1 1 0 01-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 01-1.4-1.4L8.6 10 6.3 7.7a1 1 0 010-1.4z"></path>
                        </svg>
                      </button>
                    </div>
                    </td>
                  </tr>
                  <!-- More items... -->

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>



    </div>
  </div>


    <section v-if="store.products && store.products.payload " class="bg-gray-100 py-20">
           <div class="flex justify-center">
              <button :class="store.products.hasPrevPage ? 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300' : 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled-opacity-50'
                " @click="store.getProductsFiltered('PREV')" >PREV</button>
               <button :class="store.products.hasNextPage ? 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300' : 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled-opacity-50' "
                  @click="store.getProductsFiltered('NEXT')" >NEXT</button>
            </div>
    </section>
    <section v-if="store.products && store.products.payload " class="bg-gray-100 py-20">
      <div class="flex justify-center">
            <span>PAGE: {{ store.products.page }}</span>
      </div>
    </section>


  <!-- Product modal for new product -->
  <div :class="newProductModal ? 'scale-100' : ''" class=" fixed scale-0 z-10 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">

    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

    <div :class="newProductModal ? 'scale-100' : ''" class="transform scale-0 transition-transform duration-300 relative z-10 w-full  max-w-md p-6 bg-white rounded-lg shadow-lg">

      <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">NEW PRODUCT</h2>
    </div>

    <div class="border-b border-gray-900/10 pb-12">

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
          <div class="mt-2">
            <input required ="required" v-model="store.title" type="text" name="title" id="title"  class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
          <div class="mt-2">
            <input required ="required" v-model="store.description" type="text" name="description" id="description"  class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
        </div>

        <div class="sm:col-span-4">
          <label for="code" class="block text-sm font-medium leading-6 text-gray-900">Code</label>
          <div class="mt-2">
            <input required ="required" v-model="store.code" id="code" name="code" type="text"  class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="category" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
          <div class="mt-2">
            <select required ="required" v-model="store.category" id="category" name="category"  class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Nike</option>
              <option>Adidas</option>
              <option>Puma</option>
            </select>
          </div>
        </div>

        <div class="col-span-full">
          <label for="stock" class="block text-sm font-medium leading-6 text-gray-900">Stock</label>
          <div class="mt-2">
            <input required ="required" v-model="store.stock" type="number" name="stock" id="stock"  class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
        </div>

        <div class="sm:col-span-2 sm:col-start-1">
          <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
          <div class="mt-2">
            <input required ="required" v-model="store.price" type="number" step="0.01" name="price" id="price" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline6">
          </div>
        </div>

      </div>
    </div>

  </div>

     <div class="flex justify-between mt-6">
        <button  @click="createNewProduct()" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
        CREATE
        </button>
        <button  @click="onCloseModal" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
        BACK
        </button>
      </div>

      <Transition name="fade"  :duration="{ enter: '1000', leave: '2000' }">
        <div class="flex  mt-2 mb-2 custom-error" v-if="showMessageErrorModal" >
        <div style="width:90%;text-align:center" class="mt-2 mb-2" >{{ messageErrorModal }}</div>
        <button style="width:10%" class="" @click="onCloseMessageErrorModal" >X</button>
      </div>
       </Transition>

    </div>
  </div>
</div>


<!-- Product Modal for update product -->
 <div :class="updateProductModal ? 'scale-100' : ''" class=" fixed scale-0 z-10 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">

    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

    <div :class="updateProductModal ? 'scale-100' : ''" class="transform scale-0 transition-transform duration-300 relative z-10 w-full  max-w-md p-6 bg-white rounded-lg shadow-lg">

      <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">UPDATE PRODUCT</h2>
    </div>

    <div class="border-b border-gray-900/10 pb-12">


      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
          <div class="mt-2">
            <input required ="required" v-model="store.titleUpdate" type="text" name="title" id="title"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
          <div class="mt-2">
            <input required ="required" v-model="store.descriptionUpdate" type="text" name="description" id="description"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-4">
          <label for="code" class="block text-sm font-medium leading-6 text-gray-900">Code</label>
          <div class="mt-2">
            <input required ="required" v-model="store.codeUpdate" id="code" name="code" type="text"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="category" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
          <div class="mt-2">
            <select required ="required" v-model="store.categoryUpdate" id="category" name="category"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
              <option>Nike</option>
              <option>Adidas</option>
              <option>Puma</option>
            </select>
          </div>
        </div>

        <div class="col-span-full">
          <label for="stock" class="block text-sm font-medium leading-6 text-gray-900">Stock</label>
          <div class="mt-2">
            <input required ="required" v-model="store.stockUpdate" type="number" name="stock" id="stock"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-2 sm:col-start-1">
          <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
          <div class="mt-2">
            <input required ="required" v-model="store.priceUpdate" type="number"  step="0.01" name="price" id="price" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

      </div>
    </div>

  </div>

      <div class="flex justify-between mt-6">
        <button  @click="updateProduct(store.pidForUpdate)" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
        UPDATE
        </button>
        <button  @click="onCloseModal" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
        BACK
        </button>
      </div>

      <Transition name="fade"  :duration="{ enter: '1000', leave: '2000' }">
        <div class="flex  mt-2 mb-2 custom-error" v-if="showMessageErrorModal" >
        <div style="width:90%;text-align:center" class="mt-2 mb-2" >{{messageErrorModal}}</div>
        <button style="width:10%" class="" @click="onCloseMessageErrorModal" >X</button>
      </div>
       </Transition>

    </div>
  </div>
</div>


</template>

<style scoped>

.custom-success{
  background-color: rgb(20 200 20 / 76%);
  border-radius: 5px;
  border: 1px solid black;
}

.custom-error{
  background-color: rgb(203 36 36 / 87%);
  border-radius: 5px;
  border: 1px solid black;
  margin-top: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s
}

.fade-enter,
.fade-leave-to
{
  opacity: 0
}
.disabled-opacity-50{
    pointer-events: none;
    opacity: 50%;
}

</style>