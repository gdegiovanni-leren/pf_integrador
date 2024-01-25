<script setup>
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useProductStore } from '../stores/ProductsStore';
import { useAuthStore } from '../stores/AuthStore';
import axios from "axios";

const store = useProductStore()
const authStore = useAuthStore()

let total = ref(0);
let checkout = ref(false)
let showMessageError = ref(false)
let messageError = ''
let purchase_success = ref(false)
let purchase_incomplete = ref(false)
let purchase = null


/*
for (let i = 0; i < store.productsOnCart.length; i++) {
  store.productsOnCart[i].quantity = 1;
}
*/

function onCloseMessageError(){
  showMessageError.value = false
  messageError = ''
}

async function increase(_pid){

  const item = store.productsOnCart.find(element => element._id === _pid)

  console.log(item)

  const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${store.cart_id}/products/${_pid}`
      const response = await axios.put(URL,{
       quantity: '1'
      })

   if(response.data && response.data.status == true){
    //console.log('increment success')
    item.quantity++
    const price = await item.price
    total.value += await price
   }else{
    showMessageError.value = true
    messageError = 'There was an error trying to increase'
   }


  }
  async function removeItem(_pid){

      const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${store.cart_id}/products/${_pid}`
      const response = await axios.delete(URL,{})
      //console.log('detele item call')
      if(response.data){
        if(response.data.status == true ){
          store.productsOnCart = store.productsOnCart.filter(product => product._id != _pid)
        }else{
         alert(response.data.message);
        }
      }else{
        alert('the action could not be completed')
      }
  }


  async function decrease(_pid){

    const item = store.productsOnCart.find(element => element._id === _pid)

    if(item.quantity > 1){

        const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${store.cart_id}/products/${_pid}`
        const response = await axios.put(URL,{
        quantity: '-1'
        })
          if(response.data && response.data.status == true){
            //console.log('decrement success')
            item.quantity--
            const price = await item.price
            total.value -= await price
          }else{
            showMessageError.value = true
            messageError = 'There was an error trying to decrement quantity'
          }
    }
  }

async function emptyCart(){

    const cid = store.cart_id
    try{
       const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${cid}`
       const response = await axios.delete(URL)

      if(response.data && response.data.status == true){
        //console.log('remove all items success')
        store.productsOnCart = []
        total.value = 0
      }else{
        showMessageError.value = true
        messageError = 'There was an error trying to remove products from the cart'
      }
    }catch(e){
     showMessageError.value = true
     messageError = 'There was an error trying to remove products from the cart'
    }
}

async function closeAndRestartValues(){
  purchase = null
  purchase_incomplete.value = false
  purchase_success.value = false
}

async function onPurcharse(){

    console.log('@ ON PUCHARSE CALL @')
    const cid = store.cart_id

    if(cid){
        try{
        const URL = `${import.meta.env.VITE_BASE_URL}api/carts/${cid}/purchase`
        const response = await axios.post(URL)
          console.log(response)
          if(response && response.data.status == true){
            let pids = []
            for await (let product of response.data.products_success) {
              pids.push(product._id)
            }
            //We leave only the products that could not be purchased associated with the cart
            store.productsOnCart =  store.productsOnCart.filter(x => !pids.includes(x._id))

            //we recalculate cart total price for view
            total.value = 0
            store.productsOnCart.forEach(element =>{
                total.value += (element.price * element.quantity)
                //console.log('total acumm',total.value)
            })
            console.log('response transaction: ',response.data.transaction)
            purchase = response.data
            if(response.data.transaction == 'complete'){
              //If the entire cart is sold, delete the cart id and then the redirection to home will set new one automatically
              localStorage.setItem('cart_id','')
              store.productsOnCart = []
              total.value = 0
              //complete purchase, display modal
              purchase_success.value = true
            }else{
              //partial purchase, display modal
              purchase_incomplete.value = true
            }
          }else{
            //unknown error
            messageError = response.data.message ? response.data.message : 'There was an error trying to finish purcharse..'
            showMessageError.value = true

          }

      }catch(e){
        console.log(e)
        messageError = 'There was an error trying to finish purchase.'
        showMessageError.value = true
      }
    }else{
      messageError = 'There was an error trying to finish purchase. cart id not found.'
      showMessageError.value = true
    }

}

store.productsOnCart.forEach(element =>{
  console.log('total exec')
  total.value += ( element.price * element.quantity )
})

</script>

<template>
<Navbar></Navbar>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col lg:flex-row lg:justify-between">
      <div class="w-full lg:w-2/3">
        <div class="flex flex-col mt-8">
          <div class="flex justify-between">
            <h2 class="text-lg font-medium leading-6 text-gray-900">Shopping Cart</h2>
            <div v-if="authStore.user.role == 'user' ">
            <button  @click="emptyCart()"
            :class=" store.productsOnCart.length > 0 ? 'mt-4 p-4 bg-gray-600 mr-2 text-white text-center py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50' :
             ' disabled-opacity-50 mt-4 p-4 bg-gray-600 mr-2 text-white text-center py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50' "
            >
              Empty Cart
            </button>
           </div>
          </div>
          <div class="flex-1 mt-4">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Product
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Price
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Total
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Remove</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="product in store.productsOnCart">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10">
                          <img class="w-full h-full object-contain rounded-md" :src="product.thumbnails" alt="">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{product.productName}}</div>
                          <div class="text-sm text-gray-500">{{product.type}}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{product.price}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center justify-between w-24">
                        <button class="text-gray-500 hover:text-gray-700" @click="decrease(product._id)" aria-label="Decrease quantity">
                          <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5 10h10v1H5z"></path>
                          </svg>
                        </button>
                        <span class="text-gray-700">{{ product.quantity }}</span>
                        <button class="text-gray-500 hover:text-gray-700" @click="increase(product._id)" aria-label="Increase quantity">
                          <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 5v10h1V5z"></path>
                            <path d="M5 10h10v1H5z"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">${{Math.round((product.quantity * product.price) * 1e12) / 1e12}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button class="text-gray-500 hover:text-gray-700" @click="removeItem(product._id)" aria-label="Remove item">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.3 6.3a1 1 0 011.4 0L10 8.6l2.3-2.3a1 1 0 011.4 1.4L11.4 10l2.3 2.3a1 1 0 01-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 01-1.4-1.4L8.6 10 6.3 7.7a1 1 0 010-1.4z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <!-- More items... -->

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full lg:w-1/3 mt-8 lg:mt-0">
        <div class="bg-white p-4 rounded-md shadow-md">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Summary</h3>
          <div class="mt-4">
            <div class="flex justify-between text-sm font-medium text-gray-600">
              <span>Subtotal:</span>
              <span>${{Math.round((total) * 1e11) / 1e11}}</span>
            </div>
            <div class="flex justify-between mt-2 text-sm font-medium text-gray-600">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <hr class="mt-2 mb-4">
            <div class="flex justify-between text-lg font-medium text-gray-900">
              <span>Total:</span>
              <span>${{Math.round((total) * 1e11) / 1e11}}</span>
            </div>
            <div v-if="authStore.user.role == 'user' ">
            <button @click="onPurcharse"
            :class=" store.productsOnCart.length > 0 ? 'mt-4 w-full bg-gray-800 text-white text-center py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50' :
            ' mt-4 w-full bg-gray-800 text-white text-center py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled-opacity-50'">
              Checkout
            </button>
          </div>
          </div>
        </div>
      </div>

    </div>
  </div>

    <!-- messages error/success -->
    <Transition name="fade"  :duration="{ enter: '1000', leave: '2000' }">
        <div class="flex  mt-2 mb-2 custom-error" v-if="showMessageError" >
        <div style="width:95%;text-align:center;text-transform:uppercase;" class="mt-2 mb-2" >{{ messageError }}</div>
        <button style="width:5%" class="" @click="onCloseMessageError">X</button>
      </div>
    </Transition>

  <!-- checkout modal for purchase success -->
  <div v-if="authStore.user.role == 'user' ">
  <!-- checkout & payment -->
  <div :class="purchase_success ? 'scale-100' : ''" class=" fixed scale-0 z-10 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
    <!-- Overlay background -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
    <!-- Modal content -->
    <div :class="purchase_success ? 'scale-100' : ''" class="transform scale-0 transition-transform duration-300 relative z-10 w-full  max-w-md p-6 bg-white rounded-lg shadow-lg">
      <!-- Icon -->
      <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-green-500 bg-green-100 rounded-full">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
          <path d="M17.707 4.293c-.391-.391-1.023-.391-1.414 0l-7.293 7.293-3.293-3.293c-.391-.391-1.023-.391-1.414 0-.391.391-.391 1.023 0 1.414l4 4c.195.195.451.293.707.293s.512-.098.707-.293l8-8c.391-.391.391-1.023 0-1.414z"></path>
        </svg>
      </div>
      <!-- Message -->
      <p class="text-lg font-medium text-gray-800">Purchase completed! We will shortly be sending you an email with the details.</p>
      <!-- Button -->
      <div class="mt-6">
        <button  class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
         <RouterLink @click="store.clearCart" to="/">Go Back to shopping</RouterLink>
        </button>
      </div>
    </div>
  </div>
  </div>
</div>

<!-- checkout modal for purchase error -->
<div v-if="authStore.user.role == 'user' ">
  <!-- checkout & payment -->
  <div :class="purchase_incomplete ? 'scale-100' : ''" class=" fixed scale-0 z-10 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
    <!-- Overlay background -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
    <!-- Modal content -->
    <div :class="purchase_incomplete ? 'scale-100' : ''" class="transform scale-0 transition-transform duration-300 relative z-10 w-full  max-w-md p-6 bg-white rounded-lg shadow-lg">
      <!-- Icon -->
      <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-green-500 bg-green-100 rounded-full">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20">
          <path d="M17.707 4.293c-.391-.391-1.023-.391-1.414 0l-7.293 7.293-3.293-3.293c-.391-.391-1.023-.391-1.414 0-.391.391-.391 1.023 0 1.414l4 4c.195.195.451.293.707.293s.512-.098.707-.293l8-8c.391-.391.391-1.023 0-1.414z"></path>
        </svg>
      </div>
      <!-- Message -->
      <p class="text-lg font-medium text-gray-800">Your purchase was successful! Although due to lack of stock some of your products could not be included.
        Don't worry, you can continue shopping and we will notify you when there is stock!.
      </p>
      <!-- Button -->
      <div class="mt-6">
        <button @click="closeAndRestartValues()" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
          Go Back to shopping
        </button>

      </div>
    </div>
  </div>
  </div>
</div>

</template>



<style scoped>
.disabled-opacity-50{
    pointer-events: none;
    opacity: 50%;
}
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
</style>