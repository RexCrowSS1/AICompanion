# Eclps Assistance Gratis

Aplikasi contoh AI companion lokal bernama Eclps Assistance dengan Python FastAPI, React JSX, dan PostgreSQL.

Versi ini gratis karena tidak memakai API berbayar. Secara default, algoritmanya memakai intent detection, mood detection, memory extraction, memory retrieval, dan persona response engine. Kalau ingin kualitas lebih mirip character chat seperti c.ai, aktifkan Ollama lokal agar backend memakai model LLM gratis di komputer sendiri.

## Struktur

- `backend/` - API Python FastAPI.
- `frontend/` - React JSX dengan Vite.
- `database/schema.sql` - tabel PostgreSQL.
- `docker-compose.yml` - PostgreSQL lokal.

## Menjalankan Database

```bash
docker compose up -d
```

Jika database sudah pernah dibuat sebelum file SQL masuk, jalankan:

```bash
docker exec -i ai_companion_postgres psql -U postgres -d ai_companion < database/schema.sql
```

## Menjalankan Backend

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Backend berjalan di `http://localhost:8001`.

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5174`.

Secara default frontend memakai endpoint same-origin `/api`. Vite akan meneruskannya ke
backend lokal `http://127.0.0.1:8001`, jadi alamat IP LAN tidak perlu ditulis manual.
Untuk production, isi `VITE_API_URL` dengan URL HTTPS backend atau sediakan reverse proxy `/api`.

## Menjalankan Backend dan Frontend Sekaligus

Setelah dependency backend dan frontend sudah terinstall, kamu bisa menyalakan semuanya dengan satu file:

```bash
cd /path/to/ai-companion
./start.sh
```

Script ini akan:

- menyalakan Ollama jika `OLLAMA_MODEL` aktif di `backend/.env`;
- menyalakan backend di `http://localhost:8001`;
- menyalakan frontend di `http://localhost:5174`;
- mematikan backend, frontend, dan Ollama yang dinyalakan script saat kamu menekan `CTRL+C`.

## Cara Algoritma Bekerja

1. User mengirim pesan dari React.
2. Backend mengambil 12 pesan terakhir dan 100 memori terbaru dari PostgreSQL.
3. Pesan ditokenisasi dan dicocokkan dengan daftar kata untuk mendeteksi intent.
4. Mood diperkirakan dari jumlah kata positif dan negatif.
5. Kalimat seperti `namaku Budi`, `aku suka musik`, atau `tolong ingat ...` disimpan ke tabel `memories`.
6. Memori relevan dipilih dengan skor overlap kata.
7. Jika `OLLAMA_MODEL` aktif, backend mengirim konteks, persona, memori, mood, dan histori chat ke Ollama lokal.
8. Jika Ollama tidak aktif, backend memakai fallback persona engine yang tetap bisa ngobrol natural.

## Endpoint Utama

```http
POST /chat
Content-Type: application/json

{
  "message": "namaku Dina dan aku suka kopi",
  "conversation_id": null
}
```

Response:

```json
{
  "conversation_id": 1,
  "reply": "Aku catat: namaku dina. Nanti aku bisa pakai ini supaya obrolan kita terasa lebih personal.",
  "intent": "identity",
  "mood": "neutral",
  "saved_memory": "namaku dina"
}
```

## Mode Lebih Mirip c.ai dengan Ollama

Untuk membuat balasan lebih pintar tanpa bayar API, install Ollama lalu jalankan model kecil:

```bash
ollama pull llama3.2:3b
```

Lalu ubah file `backend/.env`:

```env
COMPANION_NAME=Eclps Assistance
COMPANION_PERSONA=teman ngobrol yang hangat, perhatian, sedikit playful, dan tidak menghakimi
OLLAMA_URL=http://localhost:11434/api/chat
OLLAMA_MODEL=llama3.2:3b
OLLAMA_TIMEOUT_SECONDS=18
```

Restart backend:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

Kalau `OLLAMA_MODEL` dikosongkan, aplikasi tetap berjalan memakai algoritma lokal tanpa LLM.
