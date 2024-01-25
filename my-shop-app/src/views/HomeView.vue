<script setup>

import Carousel from '../components/Carousel.vue'
import Navbar from '../components/Navbar.vue';
import Filter from '../components/Filter.vue'
import ProductList from '../components/ProductList.vue';
import { useAuthStore } from '../stores/AuthStore'
import { useProductStore } from '../stores/ProductsStore'
import { computed, onMounted } from 'vue';


const userStore = useAuthStore()
const productStore = useProductStore()

const username = userStore.user.username

onMounted(() => {
  console.log(`the component (HOMEVIEW) is now mounted.`)
  if(!localStorage.getItem('cart_id') || localStorage.getItem('cart_id') == ''){
  productStore.getCart()
  }

  productStore.getProducts()
})

</script>


<template>
  <Navbar></Navbar>

  <div class="m-5">
    <h1 class="text-2xl text-center font-bold">Welcome, {{ username }}</h1>
  </div>

  <Carousel></Carousel>
  <Filter></Filter>
  <ProductList></ProductList>

  <footer class="bg-gray-900 py-6 lg:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center">
      <div class="text-gray-400 text-sm lg:text-base">
        &copy; 2023 My Shoe Market by Germán De Giovanni. All rights reserved.
      </div>
      <nav class="mt-4 lg:mt-0">
        <ul class="flex flex-wrap justify-center lg:justify-end gap-4">
          <li><a href="#" class="text-gray-400 hover:text-gray-200">About</a></li>
          <li><a href="#" class="text-gray-400 hover:text-gray-200">Contact</a></li>
          <li><a href="#" class="text-gray-400 hover:text-gray-200">FAQ</a></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<style scoped></style>