# Backend Shortlink

REST API untuk aplikasi shortlink, dibuat menggunakan Express.js dengan Sequelize sebagai ORM ke PostgreSQL. Ada fitur authentication (register/login pakai JWT), lalu user yang sudah login bisa membuat short link dengan slug custom atau auto-generated. List link di-cache pakai Redis biar query berulang nggak selalu hit database. Kalau slug diakses lewat endpoint publik, server akan redirect ke original URL-nya.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize
- Redis
- JWT
- Bcrypt
- Dotenv
- Swagger (swagger-jsdoc + swagger-ui-express)

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

Buat file `.env` di dalam folder `src`, isinya kira-kira seperti ini:

```env
PORT=8080

DB_NAME=shortlink_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_DIALECT=postgres

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_SECRET=isi_dengan_secret_key_kamu
JWT_EXPIRES_IN=15m

FRONTEND_URL=http://localhost:5173
```

Sesuaikan value-nya dengan konfigurasi PostgreSQL dan Redis di device masing-masing. `JWT_SECRET` wajib diisi, server akan langsung error kalau kosong.

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

Pastikan juga Redis service-nya jalan sebelum start server, soalnya link list & dashboard stats pakai cache di situ.

## Run Development

Jalankan server dengan:

```bash
npm run dev
```

Server akan berjalan menggunakan Node.js watch mode di:

```text
http://localhost:8080
```

## API Documentation (Swagger)

Dokumentasi lengkap tiap endpoint (request body, response, status code) dibuat pakai OpenAPI 3.0 lewat `swagger-jsdoc`, dan bisa dibuka langsung di browser via `swagger-ui-express`.

Setelah server jalan, buka:

```text
http://localhost:8080/api-docs
```

Dari situ bisa langsung coba tiap endpoint (termasuk yang butuh login, tinggal klik tombol **Authorize** lalu isi `Bearer <token>` hasil login).

Kalau butuh raw JSON spec-nya (misal buat di-import ke Postman/Insomnia), ada di:

```text
http://localhost:8080/api-docs.json
```

Definisi swagger-nya ada di `src/config/swagger.js`, sedangkan detail tiap endpoint ditulis langsung sebagai komentar JSDoc `@openapi` di masing-masing file route (`src/routes/*.js`) — jadi kalau ada endpoint baru atau ada perubahan request/response, cukup update komentarnya di situ, dokumentasi otomatis ikut berubah.

Ringkasan endpoint yang tersedia (detail lengkapnya cek Swagger UI):

| Method | Endpoint          | Auth | Keterangan                          |
| ------ | ----------------- | ---- | ------------------------------------ |
| POST   | `/api/register`   | -    | Daftar akun baru                     |
| POST   | `/api/login`      | -    | Login, dapat JWT token               |
| GET    | `/api/links`      | ✅   | List link milik user (pagination + search) |
| POST   | `/api/links`      | ✅   | Buat short link baru                 |
| DELETE | `/api/links/:id`  | ✅   | Hapus link milik sendiri             |
| GET    | `/api/dashboard`  | ✅   | Statistik ringkas (total link, link terbaru) |
| GET    | `/:slug`           | -    | Redirect publik ke original URL      |

Semua response mengikuti format standar:

```json
{
  "success": true,
  "message": "string",
  "results": {}
}
```

Token dari login dipakai di header `Authorization: Bearer <token>` untuk semua endpoint `/api/links` dan `/api/dashboard`.

## Assumptions & Design Decisions

- Slug bersifat unik secara global (bukan per user), jadi setiap user harus memakai slug yang berbeda satu sama lain.
- Slug custom hanya boleh berisi karakter alfanumerik dan dash, panjang 3-50 karakter, dan nggak boleh pakai kata yang sudah reserved (`api`, `login`, `register`, `dashboard`).
- User hanya bisa melihat dan menghapus link miliknya sendiri; tidak ada endpoint admin untuk melihat seluruh link.
- Password di-hash menggunakan bcrypt sebelum disimpan, tidak pernah disimpan dalam bentuk plain text.
- Redirect pakai status 301 (permanent redirect), dan hasil lookup slug → original URL di-cache di Redis selama 1 jam supaya redirect yang sering diakses nggak selalu query ke database.
