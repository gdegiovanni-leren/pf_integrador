import { defineStore } from 'pinia'
import router from '../router'
import axios from "axios"
import { ref } from 'vue'

export const useAuthStore = defineStore('auth',  {
 state: () =>({
   error: false,
   recovery_sended: false,
   recovery_token : null,
   message: ref(""),
    token: "",
    user: {
        uid : "",
        username: "",
        role: "",
        profile_name: "",
        profile_address : "",
        profile_phone : "",
        profile_picture : ""
    },
    profile_image_file : null,
    identification_file : null,
    address_file : null,
    status_account_file : null
 }),
 persist: {
   paths: ["token", "user.username", "user.role"]
 },
 actions:{


   async login(temp_username, password){

      const URL = `${import.meta.env.VITE_BASE_URL}login`
      try{
         const res = await axios.post(URL,{
         username: temp_username,
         password: password
         })

         const {message, username, role} = res.data
         this.token = message
         this.user.username = username
         this.user.role = role

         localStorage.setItem('token', this.token)

         router.push("/")
      }catch(err){
         console.error('error on login',err)
         this.error = true
       }

    },


    async register(temp_username, password, confirmPassword){

      const URL = `${import.meta.env.VITE_BASE_URL}register`
      try{
         const res = await axios.post(URL,{
            username: temp_username,
            password: password,
            confirmPassword: confirmPassword
         })
         const {token, username, role} = res.data
         this.token = token
         this.user.username = username
         this.user.role = role
         localStorage.setItem('token', this.token)
         router.push("/")
      }catch(err){
         console.error('error on register',err)
         this.error = true
         this.message = err.response.data.message
      }
    },


   async logout(){
      this.user.uid = null
      this.identification_file = null
      this.address_file = null
      this.status_account_file = null
      const URL = `${import.meta.env.VITE_BASE_URL}login/logout`
      try{
         const res = axios.post(URL,{
         username: this.user.username
         })
      }catch(err){
        console.log('error on logout',err)
       }
       await router.push("/login")
       localStorage.removeItem('auth')
       localStorage.removeItem('token')
       //localStorage.removeItem('cart_id')
    },


    //FETCH PROFILE DATA FOR USER
    async fetchProfileData(){

      const URL = `${import.meta.env.VITE_BASE_URL}api/users/profile?username=${this.user.username}`
      try{
      const res = await axios.get(URL)
      const {uid, profile_name, profile_phone , profile_address ,profile_picture } = res.data.data
      this.user.uid = uid ?? ''
      this.user.profile_name = profile_name ?? ''
      this.user.profile_address = profile_address ?? ''
      this.user.profile_phone = profile_phone ?? ''
      this.user.profile_picture = profile_picture ?? ''
      }catch(e){
         console.log(e)
         Swal.fire({
            title: 'Error!',
            text: e.response.data.message ? e.response.data.message : 'Unknown error getting your profile data, please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
            });
      }
    },

    //UPDATE PROFILE DATA
    async updateProfile(){
      console.log('UPDATE PROFILE CALL')
      const URL = `${import.meta.env.VITE_BASE_URL}api/users/profile`

        let form = new FormData()
        form.append('username', this.user.username ?? null)
        form.append('profile_name', this.user.profile_name ?? '')
        form.append('profile_address', this.user.profile_address ?? '')
        form.append('profile_phone', this.user.profile_phone ?? '')
        form.append('profile_picture', this.profile_image_file && this.profile_image_file.length > 0 ? this.profile_image_file[0] : null)

       try{
          const response = await axios.post(URL,form,{
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: form
            })
               if(response.data?.status == 200){
                  this.profile_image_file = null
                  this.user.profile_picture = response.data?.data
               }
            return response

      }catch(err){
         this.user.profile_name = '',
         this.user.profile_address = '',
         this.user.profile_phone = '',
         this.profile_image_file = null
         return err
       }
    },


    //UPLOAD PREMIUM FILES
    async uploadPremiumFiles(){
      console.log('UPDATE TO PREMIUM CALL')

      if(!this.user.uid){
         Swal.fire({
            title: "Fatal Error!",
            text: 'We couldnt find your username, please log in again!',
            icon: "error",
            confirmButtonText: 'OK'
        });
         return
      }
      const URL = `${import.meta.env.VITE_BASE_URL}api/users/${this.user.uid}/documents`
        let form = new FormData()
        form.append('username', this.user.username ?? null)
        form.append('identification_file', this.identification_file && this.identification_file.length > 0 ? this.identification_file[0] : null)
        form.append('address_file', this.address_file && this.address_file.length > 0 ? this.address_file[0] : null)
        form.append('status_account_file', this.status_account_file && this.status_account_file.length > 0 ? this.status_account_file[0] : null)

       try{
          const response = await axios.post(URL,form,{
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: form
            })

            Swal.fire({
               title: "Success",
               text: response.data?.message ? response.data?.message : 'All documents saved successfully!',
               icon: "success",
               confirmButtonText: 'OK'
           });

      }catch(err){
         console.error(err)
         Swal.fire({
            title: "Fatal Error!",
            text: err.data?.message ? err.data?.message : 'Unknown error trying to update documents. Please login again or try again later',
            icon: "error",
            confirmButtonText: 'OK'
        });
       }

    },


    //UPDATE PREMIUM MEMBRECY
    async updatePremiumMembrecy(){

      console.log('UPDATE PREMIUM MEMBRECY CALL')
      if(!this.user.uid){
         Swal.fire({
            title: "Fatal Error!",
            text: 'We couldnt find your username, please log in again!',
            icon: "error",
            confirmButtonText: 'OK'
        });
         return
      }

      const URL = `${import.meta.env.VITE_BASE_URL}api/users/premium/${this.user.uid}`
      try{
         const res = await axios.post(URL,{
         username: this.user.username,
         uid: this.user.uid,
         role: this.user.role
         })

         Swal.fire({
            title: "Success!",
            text: res.data?.message ? res.data?.message : 'Congrats! you are now a Premium User. Please login again to see all your benefits',
            icon: "success",
            confirmButtonText: 'OK',
            allowOutsideClick: () => false
        }).then((result) => {
            if (result.isConfirmed) {
                 router.push("/")
            }
         });
      }catch(err){
         //this.error = true
         Swal.fire({
            title: "Error!",
            text: err.response.data?.message ? err.response.data.message : 'Unknown error trying to update membrecy. Please log in again o try again later.',
            icon: "error",
            confirmButtonText: 'OK',
         })
      }

    },



    //PASSWORD RECOVERY

    async onRecoveryPassword(){

      console.log(this.user.username)

      const URL = `${import.meta.env.VITE_BASE_URL}login/recovery_request`
      try{
         const res = await axios.post(URL,{
            username:  this.user.username,
         })
         console.log(res.data.message)
         if(res.status == 200){
            console.log(res.data.message)
            //this.message = res.data.message
            //this.recovery_status = true
         }
      }catch(err){
         console.error(err)
         //this.error = true
         //this.message = err.response.data.message
      }
    },



    async recovery(email){

      const URL = `${import.meta.env.VITE_BASE_URL}login/password_recovery`
      try{
         const res = await axios.post(URL,{
            email: email
         })
         if(res.status == 200){
            this.message = res.data.message
            this.recovery_sended = true
            Swal.fire({
               title: "Enter your code received in your email",
               input: "text",
               inputAttributes: {
                 autocapitalize: "off"
               },
               showCancelButton: false,
               confirmButtonText: "CONFIRM",
               showLoaderOnConfirm: true,
               preConfirm: async (recovery_code) => {
                 try{
                  const URL = `${import.meta.env.VITE_BASE_URL}login/recovery_request`

                     const res = await axios.post(URL,{
                        username: email,
                        recovery_code: recovery_code
                     })
                     if(res.status == 200){
                        console.log('res status ok, recovery token added')
                        console.log('recovery token ?',res.data.recovery_token)
                        this.recovery_token = res.data.recovery_token
                     }else{
                        console.log('res status not ok, unknown error')
                     }
                 }catch(error){
                  console.log(error.response.status)
                  //only catch error for expired code and redirect
                  if(error.response.status == 410){
                     console.log('EXPIRED CODE')
                     //expired date
                     Swal.fire({
                        icon: "error",
                        text: "EXPIRED CODE",
                        allowOutsideClick: () => false
                      }).then((result) => {
                        if (result.isConfirmed) { window.location.href = '/recovery_password' }
                      });
                  }
                  this.recovery_token = null
                  if(error.response.data?.message){
                     Swal.showValidationMessage(`Error: ${error.response.data.message}`);
                  }else{
                     Swal.showValidationMessage(`Error: Unknown Error. Try again later`);
                  }
                 }
               },
               allowOutsideClick: () => false
             }).then((result) => {
               if (result.isConfirmed) {
                 /******** UPDATE PASSWORD **********/
                 Swal.fire({
                  title: "Enter your new password",
                  input: "text",
                  inputAttributes: {
                    autocapitalize: "off"
                  },
                  showCancelButton: false,
                  confirmButtonText: "CONFIRM",
                  showLoaderOnConfirm: true,
                  preConfirm: async (new_password) => {
                    try{
                     const URL = `${import.meta.env.VITE_BASE_URL}login/update_password`

                        const res = await axios.post(URL,{
                           username: email,
                           new_password : new_password,
                           recovery_token: this.recovery_token
                        })
                        if(res.status == 200){
                           this.recovery_token = null
                           return true
                           //this.recovery_token = res.data.recovery_token
                        }else{
                           console.error('res status not ok update password, unknown error')
                        }
                    }catch(error){
                     //TODO : ADD RECOVERY TOKEN TO NULL
                     //this.recovery_token = null
                     if(error.response.data?.message){
                        Swal.showValidationMessage(`Error: ${error.response.data.message}`);
                     }else{
                        Swal.showValidationMessage(`Error: Unknown Error. Try again later`);
                     }
                    }
                  },
                  allowOutsideClick: () => false
                }).then((result) => {
                  if (result.isConfirmed) {
                     Swal.fire({
                        icon: "success",
                        text: "PASSWORD UPDATED!",
                        allowOutsideClick: () => false
                      }).then((result) => {
                        if (result.isConfirmed) {
                           window.location.href = '/'
                        }
                      });
                  }
                });
                 /********************************* */
               }
             });
         }else{
            console.log('status not 200')
         }
      }catch(err){
         console.log(err)
         this.error = true
         Swal.fire({
            title: 'Error!',
            text: err.response.data.message ? err.response.data.message : 'Unknown error sending recovery email, please try again later.',
            icon: 'error',
            confirmButtonText: 'OK'
            });
      }

    },



   //FILE HANDLERS
   async handleFileUpload(e) {
      if(e.target.files && e.target.files.length > 0){
         this.profile_image_file = e.target.files
      }else{
        console.error('no target file found')
      }
  },

  async handleFileIdentification(e) {
      if(e.target.files && e.target.files.length > 0){
         this.identification_file = e.target.files
      }else{
        console.error('no target file found')
      }
  },

  async handleFileAddress(e) {
      if(e.target.files && e.target.files.length > 0){
         this.address_file = e.target.files
      }else{
        console.error('no target file found')
      }
  },

  async  handleFileStatusAccount(e) {
      if(e.target.files && e.target.files.length > 0){
         this.status_account_file = e.target.files
      }else{
        console.error('no target file found')
      }
  },

 }
})
