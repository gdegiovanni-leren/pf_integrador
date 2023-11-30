<script setup>

import { useProductStore } from '../stores/ProductsStore';


const store = useProductStore()


</script>

<template>
  <div class="flex flex-wrap justify-center md:space-x-6 ml-3 bg-gray-100">
    <!-- Category  -->
    <div class="w-full md:w-auto mb-4 md:mb-0">
      <label for="category" class="">Category</label>
      <div class="relative">
        <select  v-model="store.selectedCategory" @change="store.getProductsFiltered()" id="category" name="category"
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value="All" selected>All</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="Puma">Puma</option>
        </select>

      </div>
    </div>

    <!-- Price -->
    <div class="w-full md:w-auto mb-4 md:mb-0">
      <label for="price" class="">Price</label>
      <div class="relative">
        <select id="price" name="price" v-model="store.selectedPrice" @change="store.getProductsFiltered()"
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value="All" selected>All</option>
          <option value="Asc" >Asc</option>
          <option value="Desc" >Desc</option>
          <!--
          <option value="0-50">$0 - $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-150">$100 - $150</option>
          -->
        </select>
      </div>
    </div>

    <!-- Availability -->
    <div class="w-full md:w-auto mb-4 md:mb-0">
      <label for="availability" class="">Availability</label>
      <div class="relative">
        <select id="availability" name="availability" v-model="store.selectedAvailability" @change="store.getProductsFiltered()"
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value="All" selected>All</option>
          <option value="Stock" >Stock</option>
          <option value="Not Available" >Not Available</option>
        </select>
      </div>
    </div>

    <!-- Limit -->
    <div class="w-full md:w-auto mb-4 md:mb-0">
      <label for="limit" class="">Limit</label>
      <div class="relative">
        <select id="limit" name="limit" v-model="store.selectedLimit" @change="store.getProductsFiltered()"
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value="5" >5</option>
          <option value="10" selected>10</option>
          <option value="15" >15</option>
          <option value="20" >20</option>
          <option value="25" >25</option>
          <option value="30" >30</option>
          <option value="35" >35</option>
          <option value="40" >40</option>
          <option value="45" >45</option>
          <option value="50" >50</option>
        </select>
      </div>
    </div>

     <!-- Query filter -->
     <div class="w-full md:w-auto mb-4 md:mb-0">
      <label for="query" class="">Filter</label>
      <div class="flex relative">
        <input class="w-full md:w-auto mb-4 md:mb-0" id="query" name="query" v-model="store.query">
        <button  class="flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300" @click="store.getProductsFiltered()">Search</button>
      </div>
    </div>

    <!-- reset filters -->
    <div class="w-full md:w-auto mb-4 md:mb-0">
      <label for="query" class="">Actions</label>
      <div class="flex relative">
        <button  class="flex items-center justify-center rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300" @click="store.resetFilters()">Reset Filters</button>
      </div>
    </div>


</div></template>