# My Shoes Market - Proyecto integrador

PROYECTO FINAL INTEGRADOR . Ver proceso de compra y funcionalidades.

## SETUP ENTORNO DEVELOPMENT

- BACKEND
  - cargar .env
  - npm install
  - npm start
  - puerto default: 8080

- FRONTEND (my-shop-app)
  - npm install
  - npm run dev
  - puerto default: 5173

## DATABASE

  DATABASE_URL=mongodb://localhost:27017/shoemarket
- 1. crear una nueva DB "shoemarket"
- 2. crear una collección 'products' e importar products_example.json que se encuentra en el directorio raiz

## PRODUCTION

- https://frontend-production-b6db.up.railway.app/
- https://backend-production-2f21.up.railway.app/


## PROCESO DE COMPRA - IMPORTANTE
- Se utliliza pasarela de pago MERCADOPAGO y el proceso de compra se efectua en 3 pasos.
- Primero se debe confirmar el carrito, debido a que se debe informar a mercadopago los items y el total y esto permite que el usuario no permita modificar/alterar la compra una vez confirma (pero puede volver para atras y volver a modificar y confirmar nuevamente)
- En el paso número 2 se genera el botón de pago y via un modal se puede efectuar el pago.
- Es importante para concretar el proceso end-to-end que el pago sea aprobado en el momento (usar tarjeta de prueba):

- Numero: 5031 7557 3453 0604
- Nombre y apellido : APRO  ---> PERMITE QUE EL PAGO SEA APROBADO INSTANTANEAMENTE
- Seguridad: 123
- Caducidad: 11/25
- DNI: Cualquiera

- El tercer paso es debido a que se debe esperar la notificación via Webhook de Mercadopago, completados los dos pasos anteriores se habilitará el botón de "CHECKOUT" para finalizar la compra, en el caso de que la notificación de mercadopago haya devuelto que está paga, el proceso finalizará, se emitirá el ticket, y se enviará el email.


## FUNCIONALIDADES
- El front maneja una caché de cart y productos, si se crean carts con productos por fuera del front o se modifica la cantidad, no garantiza el correcto funcionamiento desde el front.
- Para darse de alta como ADMIN , utilizar superadmin@admin.com y la password definida en el env.
- El chat no está implementado como tal, la funcionalidad de sockets se trasladó a los comentarios de producto, para testear, ingresar con 2 sesiones diferentes a un mismo producto, en este se encontraran los comentarios que sincronizan en tiempo real simulando chat.
- El cart utiliza una cookie (cart_id). Si por motivos de prueba se desea generar un cart nuevo, borrar la cookie y actualizar pagina. Esto deberia crear un carrito nuevo al hacer reloading del home.
- El recuperar contraseña funciona un tanto diferente a como es requerido, la solución empleada es enviar un codigo de recuperacion via email que debe ser ingresado por el usuario en el paso de recuperar contraseña que corresponda (se verifica tmb tiempo de expiración)
- Desde el front la actualizaciòn de la cantidad de cada producto es de a 1. (Pero desde los endpoint se pueden mandar la cantidad puntual que se desea actualizar)
- No se utiliza persistencia con Filesystem (si bien se cuenta con la implementación del patrón factory), se utiliza MONGO.
- Todos los endpoints son funcionales desde el frontend excepto PUT api/carts/:cid que actualiza todos los productos del carrito por otros nuevos.


## EMAILS
- se envia email cuando un usuario premium elimina un producto suyo o cuando un usuario admin elimina un producto premium.
- se envia email cuando un admin elimina a un usuario puntual o cuando elimina todos los usuarios sin conexión en los ultimos 2 días.
- se envia email para recuperar contraseña.
- se envia email cuando finaliza la compra.

## TESTING DE CHECKOUT

- Además de los putnos mencionados anteriormente sobre la pasarela de pago, en el front se informará si la compra fue total (exitosa) o incompleta (por falta de stock en productos), dejando los productos que no se han podido comprar en el carrito (todo el proceso es validado y efectuado desde el back). Se enviará el email en cualquiera de los 2 casos con los productos que se hayan podido adquirir.


## AUTENTICACIÓN

- se utiliza JWT para manejo de autenticación
- no se implementa passport , pero se utiliza estategia "current" definida como el middleware "auth" en la clase auth.js
- si el token expira o es invalido se redirije al login ( validacion desde el front clase main.js). desde el back devolverá para estos casos 401 o 403


## TESTING DE AUTORIZACION POR ROLES

- cada rol es validado en todos los endpoints en el backend a través del segundo middleware "authorization" en auth.js
- para darse de alta como ADMIN, deberá matchear con el user/pass definido en el env, de esta manera se creará un usuario admin en la db
- Cada vista limita las secciones de los usuarios dependiendo del rol, y ciertas validaciones al ejecutar acciones son validadas tanto desde el front como el back.



## TECNOLOGIAS EMPLEADAS

- Vue.js 3 - Frontend framework for building user interfaces
- Tailwind 3 CSS - Utility-first CSS framework for styling.
- Express.js - Backend framework for handling API requests.
- MongoDB - Document-oriented database for data storage.
- Mongoose - MongoDB object modeling for Node.js.
- JSON Web Token (JWT) - Security technology for authentication and data exchange.
- Swagger - Swagger is a suite of tools for API developers from SmartBear Software and a former specification.
- MERCADOPAGO Checkout PRO - Checkout Pro is a solution that allows your customers to make purchases through Mercado Pago payment pages.
- Socket.io - Socket.IO is an event-driven library for real-time web applications.
- SweetAlert2 - SweetAlert2 is a js library that allows you to create pop-up windows that is easy to customize and implement.
- Splide.js - Lightweight and flexible carousel/slider library.
- Pinia - We've used Pinia for state management, making our application's data flow smooth and efficient.


# ALGUNOS ENDPOINTS (VER SWAGGER API DOCS PARA MÁS DETALLES)

## PRODUCTS

GET /api/products
query params: limit | page | category | price | availability  | query

GET /api/products/{pid}

DELETE /api/products/{pid}

POST /api/products/{pid}
expected body : { title , description, code, category, stock , price , thumbnails : [] }

PUT /api/products/{pid}
expected body : { title , description, code, category, stock , price , thumbnails : [] }


## CART

GET /api/carts
Crea un carrito vacio y retorna cid

GET /api/carts/{cid}
Retorna el carrito con productos con population

POST /api/carts/{cid}/products/{pid}
expected body : { quantity: [+/-]Integer } | { }
crea nuevo producto, si tiene cantidad se crea con la cantidad pasada, si no tiene se crea con 1 por default

PUT /api/carts/{cid}/products/{pid}
expected body : { quantity: [+/-]Integer } | { }
incremento o decremento cantidad , si no se pasa parametro incrementa o decrementa de a 1 por default

PUT /api/carts/{cid}
expected body : Array de products, ejemplo:
[
  {
      "_id": "9524b4235f9fff80f7a81f72",
      "quantity": 3
  },
  {
      "_id": "1263b1734a9ec33067981f42",
      "quantity" : 98
  }
]

DELETE /api/carts/{cid}/products/{pid}
Elimina producto especifico

DELETE api/carts/{cid}
Elimina todos los productos del carrito

POST /api/carts/{cid}/purchase
Finaliza compra, genera ticket y envia email
