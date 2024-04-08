<script setup>


import { onMounted, ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useAuthStore } from '../stores/AuthStore';


let updateProfileModal = ref(false)
const authStore = useAuthStore()

authStore.fetchProfileData()


onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // This enables smooth scrolling
    });
})

function onCloseModal(){
  updateProfileModal.value = false
}


async function uploadPremiumFiles() {

    console.log(authStore.identification_file)
    console.log(authStore.address_file)
    console.log(authStore.status_account_file)

    if(authStore.user.role == 'admin'){
        Swal.fire({
            title: "Error!",
            text: 'You dont have permissons to change your role to premium!',
            icon: "error",
            confirmButtonText: 'OK'
        });
        return;
    }
    if(authStore.user.role == 'premium'){
        Swal.fire({
            title: "Success!",
            text: 'You are ALREADY a PREMIUM member!',
            icon: "success",
            confirmButtonText: 'OK'
        });
        return
    }

    if((!authStore.identification_file || authStore.identification_file.length == 0)
      && (!authStore.address_file || authStore.address_file.length == 0)
       && (!authStore.status_account_file || authStore.status_account_file.length == 0)){
        Swal.fire({
            title: "Error!",
            text: 'you must upload at least 1 document!',
            icon: "error",
            confirmButtonText: 'OK'
        });
        return
    }

    console.log('AL LEAST ONE FILE FOUND')
    await authStore.uploadPremiumFiles()
}


async function updatePremiumMembrecy() {
    if(authStore.user.role == 'admin'){
        Swal.fire({
            title: "Error!",
            text: 'You dont have permissons to change your role to premium!',
            icon: "error",
            confirmButtonText: 'OK'
        });
        return;
    }
    if(authStore.user.role == 'premium'){
        Swal.fire({
            title: "Success!",
            text: 'You are ALREADY a PREMIUM member!',
            icon: "success",
            confirmButtonText: 'OK'
        });
        return
    }
   await authStore.updatePremiumMembrecy()
}


async function updateProfile(){
    const result = await authStore.updateProfile()
    console.log(result.data?.status)
    if(result.data?.status == 200){
    updateProfileModal.value = false
      Swal.fire({
        title: "Success!",
        icon: "success",
        text: result.data?.message  ?? 'Succesfully updated!',
        confirmButtonText: 'OK'
      });
    }else{
      Swal.fire({
        title: 'Error!',
        text: result.data?.message ?? 'Unknown error updating profile, please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
        });
    }
  }

</script>

<template>
    <Navbar></Navbar>

    <!-- PROFILE -->
    <div class="container mx-auto px-4 py-8">
        <div class="lg:flex">
            <!-- Profile picture -->
            <div class="lg:w-1/3">
                <img  :src="authStore.user.profile_picture ? authStore.user.profile_picture : './src/assets/profile-default.png'" class="w-full h-auto object-contain">
            </div>
            <!-- Profile Details -->
            <div class="lg:w-2/3 lg:pl-8 lg:pt-1">
                <h1 class="text-2xl font-bold mb-4">MY PROFILE</h1>
                <h1 class="text-2xl font-bold mb-4">USERNAME: {{ authStore.user.username }}</h1>
                <h1 class="text-2xl font-bold mb-4">ROLE: {{ authStore.user.role }}</h1>
                <h1 class="text-2xl font-bold mb-4">NAME: {{ authStore.user.profile_name ?? '' }}</h1>
                <h2 class="text-2xl font-bold mb-4"> PHONE: {{ authStore.user.profile_phone ?? '' }} </h2>
                <h2 class="text-2xl font-bold mb-4"> ADDRESS: {{ authStore.user.profile_address ?? '' }} </h2>

                <div>
                <a @click="updateProfileModal = !updateProfileModal"
                    class="cursor-pointer flex items-center justify-center md:w-[412px] rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 focus:ring-blue-300">
                    {{ 'UPDATE MY PROFILE' }}</a>
                </div>


            </div>
        </div>
    </div>

    <!-- UPLOAD FILES FOR PREMIUM -->
    <div class="container mx-auto px-4 py-8">
        <div class="lg:flex">

            <!-- Shoe Details -->
            <div class="lg:w-3/3 lg:pl-8 lg:pt-1">
                <h1 class="text-2xl font-bold mb-4" >BECOME A PREMIUM MEMBER</h1>
                <div class="sm:col-span-2 sm:col-start-1 mt-2 mb-2">
                <label for="file" class="block text-sm font-medium leading-6 text-gray-900">Identification</label>
                <div class="mt-2">
                    <input type="file" v-on:change="authStore.handleFileIdentification" >
                </div>
                </div>

                <div class="sm:col-span-2 sm:col-start-1 mt-2 mb-2">
                <label for="file" class="block text-sm font-medium leading-6 text-gray-900">Address certificate</label>
                <div class="mt-2">
                    <input type="file" v-on:change="authStore.handleFileAddress" >
                </div>
                </div>

                <div class="sm:col-span-2 sm:col-start-1 mt-2 mb-2">
                <label for="file" class="block text-sm font-medium leading-6 text-gray-900">Status account certificate</label>
                <div class="mt-2">
                    <input type="file" v-on:change="authStore.handleFileStatusAccount" >
                </div>
                </div>

                <p class="mt-3 mb-3">* to become a Premium user and take advantage of all the benefits you must complete the registration forms
                <strong> Identification, Proof of address, Proof of account status.  </strong>
               </p>

               <div class="mt-3 mb-3">
                <a @click="uploadPremiumFiles()"
                    class="cursor-pointer flex items-center justify-center md:w-[412px] rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 focus:ring-blue-300">
                    {{ 'UPLOAD FILES' }}</a>
                </div>

                <div class="mt-3">
                <a @click="updatePremiumMembrecy()"
                    class="cursor pointer bg-green-600 cursor-pointer flex items-center justify-center md:w-[412px] rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300">
                    {{ 'GET MY PREMIUM MEMBRECY!' }}</a>
                </div>


            </div>
        </div>
    </div>


 <!-- Product modal for update profile -->
<div :class="updateProfileModal ? 'scale-100' : ''" class=" fixed scale-0 z-10 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">

    <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>

    <div :class="updateProfileModal ? 'scale-100' : ''" class="transform scale-0 transition-transform duration-300 relative z-10 w-full  max-w-md p-6 bg-white rounded-lg shadow-lg">

      <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">MY PROFILE</h2>
    </div>

    <div class="border-b border-gray-900/10 pb-12">


      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
          <div class="mt-2">
            <input required ="required" v-model="authStore.user.profile_name" type="text" name="profile_name" id="profile_name"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
          <div class="mt-2">
            <input required ="required" v-model="authStore.user.profile_address" type="text" name="profile_address" id="profile_address"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
          <div class="mt-2">
            <input required ="required" v-model="authStore.user.profile_phone" type="text" name="profile_phone" id="profile_phone"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div class="sm:col-span-2 sm:col-start-1">
          <label for="file" class="block text-sm font-medium leading-6 text-gray-900">Images</label>
          <div class="mt-2">
            <input type="file" v-on:change="authStore.handleFileUpload" >
          </div>
        </div>

      </div>
    </div>

  </div>

      <div class="flex justify-between mt-6">
        <button  @click="updateProfile" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
        UPDATE
        </button>
        <button  @click="onCloseModal" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500">
        BACK
        </button>
      </div>


    </div>
  </div>
</div>

</template>