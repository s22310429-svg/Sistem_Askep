# Sistem Askep (Sistem Asuhan Keperawatan)

Aplikasi manajemen asuhan keperawatan berbasis web yang membantu perawat dalam mengelola data pasien, membuat rencana asuhan keperawatan (Askep) berbasis AI, mencatat implementasi tindakan, melakukan evaluasi, dan menghasilkan laporan.

## Arsitektur

```
Sistem_Askep/
├── backend/          # Express.js REST API (port 5000)
│   ├── bin/www       # Entry point server
│   ├── data/         # In-memory data store
│   ├── middleware/    # Authentication middleware
│   ├── routes/api/   # API route handlers
│   └── app.js        # Express app configuration
├── frontend/         # React.js SPA (port 3000)
│   └── src/
│       ├── assets/       # CSS stylesheets
│       ├── components/   # Shared components (Header, Sidebar, Footer)
│       ├── pages/        # Page components
│       └── services/     # API service layer
└── .gitignore
```

## Tech Stack

| Layer     | Teknologi                         |
| --------- | --------------------------------- |
| Frontend  | React 19, React Router DOM 7      |
| Backend   | Express.js 4, Node.js             |
| Auth      | Token-based (SHA-256 hashing)     |
| Data      | In-memory store (tanpa database)  |
| CORS      | Enabled untuk development         |

## Cara Menjalankan

### Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** (terinstal bersama Node.js)

### 1. Clone Repository

```bash
git clone https://github.com/s22310429-svg/Sistem_Askep.git
cd Sistem_Askep
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Jalankan Backend (Terminal 1)

```bash
cd backend
npm start
```

Server berjalan di **http://localhost:5000**

### 4. Jalankan Frontend (Terminal 2)

```bash
cd frontend
npm start
```

Aplikasi terbuka di **http://localhost:3000**

### 5. Login

| Field    | Value       |
| -------- | ----------- |
| Username | `admin`     |
| Password | `admin123`  |

## Fitur Utama

### 1. Autentikasi
- Login & Register
- Token-based session management
- Ubah password & edit profil

### 2. Manajemen Pasien
- CRUD data pasien (Tambah, Lihat, Edit, Hapus)
- Pencarian & filter berdasarkan status
- Statistik jumlah pasien per status

### 3. Askep AI Plan
- Generate rencana asuhan keperawatan otomatis berdasarkan diagnosa
- Edit intervensi secara inline
- Simpan rencana ke server

### 4. Implementasi
- Daftar intervensi yang perlu dilaksanakan (pending)
- Form pencatatan implementasi (catatan, respon pasien, tanda vital)
- Riwayat implementasi yang sudah selesai
- Detail & cetak implementasi

### 5. Evaluasi
- Monitoring status pasien (Membaik, Monitoring, Memburuk)
- Timeline progress per pasien
- Tren nyeri visual (bar chart)
- Export data evaluasi ke CSV

### 6. Laporan
- Ringkasan statistik keseluruhan
- Tabel & kartu laporan per pasien
- Filter berdasarkan status & pencarian
- Detail laporan, export CSV, dan cetak

### 7. Dashboard
- Statistik real-time (Total Pasien, Askep Aktif, Implementasi, Laporan)
- Riwayat aktivitas terbaru
- Navigasi cepat ke semua modul

### 8. Profil
- Informasi profil pengguna
- Ubah password
- Edit profil (nama lengkap, email)
- Riwayat aktivitas akun

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint    | Deskripsi             |
| ------ | ----------- | --------------------- |
| POST   | `/login`    | Login pengguna        |
| POST   | `/register` | Registrasi pengguna   |
| GET    | `/profile`  | Dapatkan profil       |
| PUT    | `/profile`  | Update profil         |
| PUT    | `/password` | Ubah password         |
| POST   | `/logout`   | Logout                |

### Patients (`/api/patients`)
| Method | Endpoint | Deskripsi              |
| ------ | -------- | ---------------------- |
| GET    | `/`      | Daftar semua pasien    |
| GET    | `/:id`   | Detail pasien          |
| POST   | `/`      | Tambah pasien baru     |
| PUT    | `/:id`   | Update data pasien     |
| DELETE | `/:id`   | Hapus pasien           |

### Askep AI Plan (`/api/askep`)
| Method | Endpoint          | Deskripsi                    |
| ------ | ----------------- | ---------------------------- |
| POST   | `/generate`       | Generate rencana askep (AI)  |
| POST   | `/save`           | Simpan rencana askep         |
| GET    | `/`               | Daftar rencana askep         |
| PUT    | `/intervention/:id` | Update intervensi          |

### Implementasi (`/api/implementations`)
| Method | Endpoint     | Deskripsi                     |
| ------ | ------------ | ----------------------------- |
| GET    | `/pending`   | Intervensi pending            |
| GET    | `/completed` | Implementasi selesai          |
| GET    | `/:id`       | Detail implementasi           |
| POST   | `/`          | Simpan implementasi baru      |
| PUT    | `/:id`       | Update implementasi           |

### Evaluasi (`/api/evaluations`)
| Method | Endpoint  | Deskripsi                  |
| ------ | --------- | -------------------------- |
| GET    | `/`       | Daftar evaluasi            |
| GET    | `/export` | Export evaluasi ke CSV     |

### Laporan (`/api/reports`)
| Method | Endpoint       | Deskripsi                |
| ------ | -------------- | ------------------------ |
| GET    | `/`            | Daftar laporan & summary |
| GET    | `/:id`         | Detail laporan           |
| GET    | `/export/csv`  | Export laporan ke CSV    |

### Dashboard (`/api/dashboard`)
| Method | Endpoint      | Deskripsi              |
| ------ | ------------- | ---------------------- |
| GET    | `/stats`      | Statistik dashboard    |
| GET    | `/activities` | Aktivitas terbaru      |

## Struktur Frontend Pages

| File               | Halaman                      |
| ------------------ | ---------------------------- |
| `login.js`         | Halaman login                |
| `regis.js`         | Halaman registrasi           |
| `dashboard.js`     | Dashboard utama              |
| `pasien.js`        | Manajemen data pasien        |
| `askepaiplan.js`   | Askep AI Plan Generator      |
| `implementasi.js`  | Pencatatan implementasi      |
| `evaluasi.js`      | Evaluasi pasien              |
| `laporan.js`       | Laporan keperawatan          |
| `Profile.js`       | Profil & pengaturan akun     |

## Catatan Penting

- **Data bersifat in-memory** — semua data akan hilang ketika backend di-restart. Cocok untuk development dan demo.
- **Port default**: Backend = `5000`, Frontend = `3000`.
- **CORS** dikonfigurasi untuk menerima semua origin dalam mode development.
- Untuk production, disarankan menambahkan database (MySQL/PostgreSQL/MongoDB) dan environment variables.

## 👤 Author

Dibuat sebagai project Sistem Asuhan Keperawatan.
