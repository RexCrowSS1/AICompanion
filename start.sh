#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PORT="${BACKEND_PORT:-8001}"
FRONTEND_PORT="${FRONTEND_PORT:-5174}"

BACKEND_PID=""
FRONTEND_PID=""
OLLAMA_PID=""

cleanup() {
  echo ""
  echo "Mematikan server..."
  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "$OLLAMA_PID" ]] && kill -0 "$OLLAMA_PID" 2>/dev/null; then
    kill "$OLLAMA_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

has_command() {
  command -v "$1" >/dev/null 2>&1
}

env_value() {
  local key="$1"
  local file="$BACKEND_DIR/.env"
  if [[ ! -f "$file" ]]; then
    return 0
  fi
  grep -E "^${key}=" "$file" | tail -n 1 | cut -d= -f2-
}

wait_for_backend() {
  local url="http://localhost:$BACKEND_PORT/health"
  local attempt

  for attempt in {1..40}; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.25
  done

  echo "Backend belum siap setelah menunggu beberapa detik."
  echo "Cek terminal backend atau pastikan database PostgreSQL sudah berjalan."
  return 1
}

echo "Menyiapkan Eclps Assistance..."

if [[ ! -d "$BACKEND_DIR/.venv" ]]; then
  echo "Backend virtualenv belum ada. Buat dulu dengan:"
  echo "cd \"$BACKEND_DIR\" && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Frontend node_modules belum ada. Buat dulu dengan:"
  echo "cd \"$FRONTEND_DIR\" && npm install"
  exit 1
fi

OLLAMA_MODEL="$(env_value OLLAMA_MODEL)"
if [[ -n "$OLLAMA_MODEL" ]]; then
  if has_command ollama; then
    if ! ollama list >/dev/null 2>&1; then
      echo "Menyalakan Ollama..."
      ollama serve &
      OLLAMA_PID="$!"
      sleep 2
    fi
    if ollama list | awk '{print $1}' | grep -qx "$OLLAMA_MODEL"; then
      echo "Ollama aktif dengan model: $OLLAMA_MODEL"
    else
      echo "Model Ollama '$OLLAMA_MODEL' belum ditemukan."
      echo "Install model dengan: ollama pull $OLLAMA_MODEL"
      echo "Aplikasi tetap menyala, tapi backend akan memakai fallback jika Ollama tidak bisa dipakai."
    fi
  else
    echo "Ollama tidak ditemukan. Backend akan memakai fallback lokal."
  fi
fi

echo "Menyalakan backend di http://localhost:$BACKEND_PORT"
(
  cd "$BACKEND_DIR"
  source .venv/bin/activate
  uvicorn app.main:app --reload --port "$BACKEND_PORT"
) &
BACKEND_PID="$!"

echo "Menunggu backend siap..."
wait_for_backend

echo "Menyalakan frontend di http://localhost:$FRONTEND_PORT"
(
  cd "$FRONTEND_DIR"
  npm run dev -- --port "$FRONTEND_PORT"
) &
FRONTEND_PID="$!"

echo ""
echo "Eclps Assistance sudah berjalan."
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo "Tekan CTRL+C di terminal ini untuk mematikan semuanya."
echo ""

wait "$BACKEND_PID" "$FRONTEND_PID"
