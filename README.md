# Backend

Backend API built with Node.js, Express, PostgreSQL, and Sequelize.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JWT
- Bcrypt
- CORS
- Dotenv

## Installation

Clone repository:

```bash
git clone <repository-url>
cd backend
```

Install dependencies:

```bash
npm install
```

## Database Setup

Buat database terlebih dahulu di PostgreSQL.
Kemudian jalankan migration Sequelize:

```bash
npx sequelize-cli db:migrate
```

Membuat data seeder:

```bash
npx sequelize-cli db:seed:all
```

Membatalkan migration terakhir:

```bash
npx sequelize-cli db:migrate:undo
```

## Run Development

Jalankan server dengan:

```bash
npm run dev
```

Server akan berjalan menggunakan Node.js watch mode.

```text
http://localhost:8080
```
