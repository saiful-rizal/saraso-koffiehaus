# Saraso Koffiehaus — React + Database JSON

Konversi dari Laravel (Blade + MySQL) ke **React (Vite) + database JSON**.
Siap hosting di Vercel dengan nama project `saraso-koffiehaus`.

## Database (`db.json`)

Satu file JSON berisi 3 "tabel": `users`, `menus` (39 item, sama seperti
`MenuSeeder`), `orders` (mulai kosong).

- Saat aplikasi dibuka, isi `db.json` dimuat sebagai seed.
- Semua perubahan (register, tambah pesanan, checkout, hapus) disimpan ke
  `localStorage` (`saraso-db-v1`) — jadi data tetap ada setelah refresh.
- Tombol **"Reset demo"** di halaman Pesanan mengembalikan ke isi awal `db.json`.
- Password di `db.json` polos hanya untuk demo. Jangan pakai untuk produksi
  sungguhan.

Akun demo:

| Email                        | Password    |
| ---------------------------- | ----------- |
| admin@sarasokoffiehaus.id    | password123 |
| test@example.com             | password123 |

## Jalankan lokal

```bash
cd saraso-app
npm install
npm run dev
# buka http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Hosting di Vercel

1. Push folder ini ke GitHub (atau seluruh repo, lalu set **Root Directory**
   ke `saraso-app`).
2. Vercel → New Project → import repo → Project Name: `saraso-koffiehaus`.
3. Framework Preset: Vite. Build Command: `npm run build`. Output: `dist`.
4. Deploy — tidak perlu environment variable / database eksternal.

## Rute

| Rute        | Halaman              | Akses        |
| ----------- | -------------------- | ------------ |
| `/`         | Landing + katalog    | Publik       |
| `/login`    | Login                | Guest        |
| `/register` | Register             | Guest        |
| `/pesan`    | Pesan + keranjang    | Login        |
| `/pesanan`  | Riwayat pesanan      | Login        |
