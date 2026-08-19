# Backend Shortlink

REST API untuk aplikasi shortlink, dibuat menggunakan Express.js dengan Sequelize sebagai ORM ke PostgreSQL. Ada fitur authentication (register/login pakai JWT), lalu user yang sudah login bisa membuat short link dengan slug custom atau auto-generated. Kalau slug diakses lewat endpoint publik, server akan redirect ke original URL-nya.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- JWT
- Bcrypt
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

## Environment Variables

Buat file `.env` di root project, isinya kira-kira seperti ini:

```env
PORT=8080

DB_NAME=shortlink_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_DIALECT=postgres

JWT_SECRET=isi_dengan_secret_key_kamu
```

Sesuaikan value-nya dengan konfigurasi PostgreSQL di device masing-masing.

## Database Setup

Pastikan PostgreSQL sudah terinstall dan service-nya jalan. Buat database terlebih dahulu:

```bash
npx sequelize-cli db:create
```

Jalankan migration:

```bash
npx sequelize-cli db:migrate
```

Kalau perlu data dummy, jalankan seeder:

```bash
npx sequelize-cli db:seed:all
```

Untuk membatalkan migration terakhir (misalnya salah struktur tabel):

```bash
npx sequelize-cli db:migrate:undo
```

## Run Development

Jalankan server dengan:

```bash
npm run dev
```

Server akan berjalan menggunakan Node.js watch mode di:

```text
http://localhost:8080
```

## API Documentation

Semua response mengikuti format standar:

```json
{
  "success": true,
  "message": "string",
  "results": {}
}
```

### Auth

**Register**

`POST /api/auth/register`

Request body:

```json
{
  "email": "user@mail.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Register berhasil",
  "results": {
    "id": 1,
    "email": "user@mail.com"
  }
}
```

**Login**

`POST /api/auth/login`

Request body:

```json
{
  "email": "user@mail.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login berhasil",
  "results": {
    "token": "jwt_token_here"
  }
}
```

Token ini dipakai di header `Authorization: Bearer <token>` untuk semua endpoint links di bawah.

### Links

**Create Link** — `POST /api/links` (auth required)

Request body:

```json
{
  "original_url": "https://example.com/artikel-panjang",
  "slug": "artikel-saya"
}
```

`slug` bersifat opsional. Kalau tidak diisi, akan digenerate otomatis.

Response:

```json
{
  "success": true,
  "message": "Link berhasil dibuat",
  "results": {
    "id": 1,
    "original_url": "https://example.com/artikel-panjang",
    "slug": "artikel-saya",
    "short_url": "http://localhost:8080/artikel-saya",
    "created_at": "2026-08-19T10:00:00.000Z"
  }
}
```

**Get All Links** — `GET /api/links` (auth required)

Mengembalikan seluruh link milik user yang sedang login.

Response:

```json
{
  "success": true,
  "message": "Berhasil mengambil data link",
  "results": [
    {
      "id": 1,
      "original_url": "https://example.com/artikel-panjang",
      "slug": "artikel-saya",
      "short_url": "http://localhost:8080/artikel-saya",
      "created_at": "2026-08-19T10:00:00.000Z"
    }
  ]
}
```

**Delete Link** — `DELETE /api/links/:id` (auth required)

Menghapus link, hanya bisa dilakukan oleh pemilik link tersebut.

Response:

```json
{
  "success": true,
  "message": "Link berhasil dihapus",
  "results": null
}
```

**Redirect** — `GET /:slug` (public)

Endpoint ini tidak memakai prefix `/api`, karena tujuannya supaya short URL yang dibagikan ke user lain tetap pendek. Kalau slug ditemukan, server akan redirect (302) ke `original_url`. Kalau tidak ditemukan, akan mengembalikan response error 404.

## Assumptions & Design Decisions

- Slug bersifat unik secara global (bukan per user), jadi setiap user harus memakai slug yang berbeda satu sama lain.
- Slug custom hanya boleh berisi karakter alfanumerik dan dash, untuk menghindari konflik dengan URL routing lain.
- User hanya bisa melihat dan menghapus link miliknya sendiri; tidak ada endpoint admin untuk melihat seluruh link.
- Password di-hash menggunakan bcrypt sebelum disimpan, tidak pernah disimpan dalam bentuk plain text.
