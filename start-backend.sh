#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
BACKEND_PORT="${BACKEND_PORT:-8001}"
BACKEND_PYTHON="$BACKEND_DIR/.venv/bin/python"

OLLAMA_PID=""

cleanup() {
  echo ""
  echo "Mematikan backend..."
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

echo "Menyiapkan backend Eclps Assistance..."

if [[ ! -x "$BACKEND_PYTHON" ]]; then
  echo "Backend virtualenv belum ada. Buat dulu dengan:"
  echo "cd \"$BACKEND_DIR\" && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

OLLAMA_MODEL="$(env_value OLLAMA_MODEL)"
if [[ -n "$OLLAMA_MODEL" ]]; then
  if has_command ollama; then
    if ! ollama list >/dev/null 2>&1; then
      echo "Menyalakan Ollama..."
      ollama serve > /tmp/ollama.log 2>&1 &
      OLLAMA_PID="$!"
      sleep 2
    fi

    if ollama list | awk '{print $1}' | grep -qx "$OLLAMA_MODEL"; then
      echo "Ollama aktif dengan model: $OLLAMA_MODEL"
    else
      echo "Model Ollama '$OLLAMA_MODEL' belum ditemukan."
      echo "Install model dengan: ollama pull $OLLAMA_MODEL"
      echo "Backend tetap bisa jalan dengan fallback jika Ollama tidak tersedia."
    fi
  else
    echo "Ollama tidak ditemukan. Backend akan memakai fallback lokal."
  fi
fi

echo "Menyalakan backend di http://localhost:$BACKEND_PORT"
(
  cd "$BACKEND_DIR"
  "$BACKEND_PYTHON" -m uvicorn app.main:app --host 0.0.0.0 --port "$BACKEND_PORT"
)
