# My Shoes Market - Proyecto integrador

Segunda entrega de proyecto integrador. Ver alcance y supuestos.

## SETUP

- BACKEND :
- npm install
- npm start
- puerto default: 8080

- FRONTEND (my-shop-app) :
- npm install
- npm run dev
- puerto default: 5173

## DATABASE

  DATABASE_URL=mongodb://localhost:27017/shoemarket
- 1. crear una nueva DB shoemarket
- 2. crear una collección 'products' e importar products_example.json que se encuentra en el directorio raiz


## ALCANCE Y SUPUESTOS

- No se utiliza Multer ni se permite cargar imagenes desde el front en el CRUD de producto. (se pueden cargar via API)
- No se utiliza sockets, se implementarán para la entrega final para el manejo de comentarios en los productos y otras features.
- Si bien cuenta con login implementado y JWT para manejo de autenticaciòn, no se manejan sesiones y las verificaciones de token para los endpoints que no sean register y login estàn deshabilitadas para propositos de prueba.
- No se hace distincion entre roles de usuario (un usuario logeado puede entrar al panel de admin y crear productos).
- Tods los endpoints son funcionales desde el frontend excepto PUT api/carts/:cid que actualiza todos los productos del carrito por otros nuevos.
- el cart utiliza una cookie (cart_id). Si por motivos de prueba se desea generar un cart nuevo, borrar la cookie y actualizar pagina. Esto deberia crear un carrito nuevo al hacer reloading del home.
- el front maneja una caché de cart, si se crean carts con productos por fuera del front, no garantiza el correcto funcionamiento desde el front
- Desde el front la actualizaciòn de la cantidad de cada producto es de a 1. (Pero desde los endpoint se pueden mandar la cantidad puntual que se desea actualizar)
- Los filtros se encuentran en la home del producto, no se aplican en la vista de admin, si bien esta cuenta con una paginaciòn funcional



## ENDPOINTS

# PRODUCTS

GET /api/products
query params: limit | page | category | price | availability  | query

GET /api/products/{pid}

DELETE /api/products/{pid}

POST /api/products/{pid}
expected body : { title , description, code, category, stock , price , thumbnails : [] }

PUT /api/products/{pid}
expected body : { title , description, code, category, stock , price , thumbnails : [] }


# CART

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



## TECNOLOGIAS USADAS

- Vue.js 3 - Frontend framework for building user interfaces
- Tailwind 3 CSS - Utility-first CSS framework for styling
- Express.js - Backend framework for handling API requests
- MongoDB - Document-oriented database for data storage
- Mongoose - MongoDB object modeling for Node.js
- Splide.js - Lightweight and flexible carousel/slider library
- JSON Web Token (JWT) - Security technology for authentication and data exchange
- Pinia - We've used Pinia for state management, making our application's data flow smooth and efficient.
