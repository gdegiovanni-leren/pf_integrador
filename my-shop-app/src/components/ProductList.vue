<script setup>
import { useProductStore } from '../stores/ProductsStore';
import { useAuthStore } from '../stores/AuthStore'
import Product from './Product.vue';
import { computed, onMounted } from 'vue';
const store = useProductStore()
const userStore = useAuthStore()

onMounted(() => {
  //store.getProducts()
})

const username = userStore.user.username
/*
    const filteredProducts = computed(() => {
        let products = store.products

        console.log('call computed')

      return products
    })
*/
</script>


<style scoped>
.disabled-opacity-50{
    pointer-events: none;
    opacity: 50%;
}
</style>


<template>
    <section v-if="store.products && store.products.payload " class="bg-gray-100 ">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-y-1 gap-x-1">

                <Product v-for="product in store.products.payload" :product-name="product.title" :key="product._id" :price="product.price"
                    :stock="product.stock"
                    :product-img="product.thumbnails" :id="product._id"></Product>
                     <h1 v-show="store.products.payload.length === 0">There are no products for this filters...</h1>
            </div>
            <div class="flex justify-center">
                <button :class="store.products.hasPrevPage ? 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300' : 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled-opacity-50'
                 " @click="store.getProductsFiltered('PREV')" >PREV</button>
                <button :class="store.products.hasNextPage ? 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300' : 'flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled-opacity-50' "
                 @click="store.getProductsFiltered('NEXT')" >NEXT</button>
            </div>
        </div>
    </section>
    <section v-if="store.products && store.products.payload " class="bg-gray-100 m-5">
            <div class="flex justify-center">
                <span>PAGE: {{ store.products.page }} |  TOTAL: {{ store.products.totalPages }}</span>
            </div>
    </section>
    <section v-if="store.products && store.products.payload " class="bg-gray-100 m-5">
            <div style="margin:auto;" class="flex justify-center max-w-md">
                <input type="text" v-model="store.go_to" class="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight self-auto focus:outline-none focus:shadow-outline" />
                <button style="border:1px solid black;" class="px-4 py-2 text-sm font-medium text-black bg-grey-500 rounded hover:bg-grey-600 focus:outline-none focus:ring focus:ring-grey-500" @click="store.goToPage(store.go_to)">GO TO</button>
            </div>
    </section>


</template>
