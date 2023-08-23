# Live Link: https://digital-cow-hut-backend-pearl.vercel.app/

## Application Routes:

### User

- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/auth/signup (POST)
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/users (GET)
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/users/64e489041ef492c69ed33200 (Single GET) Include an id that is saved in database
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/users/64e489041ef492c69ed33200 (PATCH) Include an id that is saved in database
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/users/64e489041ef492c69ed33200 (DELETE) Include an id that is saved in database

### Cows

- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows (POST)
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows (GET)
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows/64e4e03ba96bcdb8181b2c36 (Single GET) Include an id that is saved in database
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows/64e4e03ba96bcdb8181b2c36 (PATCH) Include an id that is saved in database
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows/64e4e03ba96bcdb8181b2c36 (DELETE) Include an id that is saved in database

### Pagination and Filtering routes of Cows

- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows?pag=1&limit=10
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows?sortBy=price&sortOrder=asc
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows?minPrice=200&maxPrice=7000
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows?location=Dhaka
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/cows?searchTerm=Com

## Orders

- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/orders (POST)
- https://digital-cow-hut-backend-pearl.vercel.app/api/v1/orders (GET)
