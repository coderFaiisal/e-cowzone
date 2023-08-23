# Live Link: https://digital-cow-hut-backend-pearl.vercel.app/

## Application Routes:

### User

- api/v1/auth/signup (POST)
- api/v1/users (GET)
- api/v1/users/64e489041ef492c69ed33200 (Single GET)
- api/v1/users/64e489041ef492c69ed33200 (PATCH)
- api/v1/users/64e489041ef492c69ed33200 (DELETE) Include an id that is saved in your database

### Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/64e4e03ba96bcdb8181b2c36 (Single GET)
- api/v1/cows/64e4e03ba96bcdb8181b2c36 (PATCH)
- api/v1/cows/64e4e03ba96bcdb8181b2c36 (DELETE)

### Pagination and Filtering routes of Cows

- api/v1/cows?pag=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=200&maxPrice=7000
- api/v1/cows?location=Dhaka
- api/v1/cows?searchTerm=Com

## Orders

- api/v1/orders (POST)
- api/v1/orders (GET)
