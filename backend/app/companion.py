import json
import random
import re
import urllib.error
import urllib.request
from collections import Counter

from .settings import settings


STOPWORDS = {
    "aku", "saya", "kamu", "dia", "ini", "itu", "yang", "dan", "atau", "di",
    "ke", "dari", "untuk", "dengan", "aja", "dong", "nih", "ya", "kok",
    "banget", "lagi", "jadi", "adalah", "the", "a", "an", "is", "are",
    "nya", "pun", "kan", "lah", "dong", "deh", "sih",
}

POSITIVE_WORDS = {
    "senang", "bahagia", "lega", "semangat", "baik", "suka", "mantap",
    "keren", "hebat", "berhasil", "love", "happy", "great", "bangga",
    "tenang", "lucu", "asyik", "excited",
}

NEGATIVE_WORDS = {
    "sedih", "capek", "lelah", "marah", "takut", "cemas", "khawatir",
    "sendiri", "kesepian", "gagal", "buruk", "stress", "stres", "anxious",
    "bingung", "kecewa", "hancur", "sakit", "nangis", "overthinking",
}

CRISIS_WORDS = {
    "bunuh diri", "mengakhiri hidup", "mati aja", "self harm", "menyakiti diri",
    "melukai diri", "suicide",
}

INTENTS = {
    "greeting": ["halo", "hai", "hi", "pagi", "siang", "sore", "malam"],
    "vent": ["sedih", "capek", "lelah", "stress", "stres", "marah", "takut", "cemas", "kecewa"],
    "advice": ["saran", "menurutmu", "gimana", "bagaimana", "harus", "solusi", "pilih"],
    "gratitude": ["makasih", "terima kasih", "thanks", "thank you"],
    "identity": ["namaku", "nama saya", "aku suka", "saya suka", "ingat", "hobiku"],
    "roleplay": ["anggap", "ceritanya", "roleplay", "pura-pura", "kamu jadi"],
}

FOLLOW_UPS = {
    "greeting": [
        "Aku pengin dengar versi jujurnya, bukan versi 'baik-baik aja' kalau memang lagi tidak begitu.",
        "Mau mulai dari cerita ringan dulu, atau langsung ke yang paling kepikiran?",
    ],
    "vent": [
        "Kalau kamu mau, kita bisa urutkan pelan-pelan: apa yang terjadi, apa yang kamu rasakan, lalu apa yang paling kamu butuhkan sekarang.",
        "Aku di sini. Bagian paling beratnya yang mana?",
    ],
    "advice": [
        "Kasih aku sedikit konteks lagi, nanti aku bantu bikin pilihan yang lebih masuk akal.",
        "Kita bisa cari opsi yang paling realistis, bukan yang kelihatan sempurna di kepala.",
    ],
    "chat": [
        "Ceritain lanjutannya, aku ngikut.",
        "Aku penasaran bagian itu terasa penting karena apa buat kamu?",
    ],
}


def tokenize(text: str) -> list[str]:
    words = re.findall(r"[a-zA-ZÀ-ÿ0-9']+", text.lower())
    return [word for word in words if word not in STOPWORDS and len(word) > 1]


def detect_mood(tokens: list[str]) -> str:
    positives = sum(1 for token in tokens if token in POSITIVE_WORDS)
    negatives = sum(1 for token in tokens if token in NEGATIVE_WORDS)
    if negatives >= positives + 2:
        return "very_down"
    if negatives > positives:
        return "down"
    if positives > negatives:
        return "good"
    return "neutral"


def detect_intent(text: str, tokens: list[str]) -> str:
    lowered = text.lower()
    if any(word in lowered for word in CRISIS_WORDS):
        return "crisis"
    for intent, keywords in INTENTS.items():
        if any(keyword in lowered or keyword in tokens for keyword in keywords):
            return intent
    if "?" in text:
        return "advice"
    return "chat"


def extract_memory(text: str) -> str | None:
    lowered = text.lower().strip()
    patterns = [
        r"(?:namaku|nama saya)\s+([a-zA-ZÀ-ÿ ]{2,40})",
        r"(?:aku suka|saya suka|hobiku)\s+([a-zA-ZÀ-ÿ0-9 ,.'-]{2,80})",
        r"(?:aku punya|saya punya)\s+([a-zA-ZÀ-ÿ0-9 ,.'-]{2,80})",
        r"(?:aku sedang|saya sedang)\s+([a-zA-ZÀ-ÿ0-9 ,.'-]{2,80})",
        r"(?:aku ingin|saya ingin|aku mau|saya mau)\s+([a-zA-ZÀ-ÿ0-9 ,.'-]{2,80})",
    ]
    for pattern in patterns:
        match = re.search(pattern, lowered)
        if match:
            return match.group(0).strip()
    if lowered.startswith("ingat ") or lowered.startswith("tolong ingat "):
        return lowered.replace("tolong ", "", 1).strip()
    return None


def rank_memories(message: str, memories: list[dict], limit: int = 4) -> list[dict]:
    message_terms = Counter(tokenize(message))
    scored = []
    for memory in memories:
        memory_terms = Counter(tokenize(memory["content"]))
        overlap = sum((message_terms & memory_terms).values())
        recency_bonus = 0.15
        if overlap:
            scored.append((overlap + recency_bonus, memory))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [memory for _, memory in scored[:limit]]


def conversation_summary(recent_messages: list[dict], limit: int = 8) -> str:
    lines = []
    for item in recent_messages[-limit:]:
        role = "User" if item["role"] == "user" else settings.companion_name
        content = item["content"].strip().replace("\n", " ")
        lines.append(f"{role}: {content[:500]}")
    return "\n".join(lines)


def ollama_reply(message: str, memories: list[dict], recent_messages: list[dict], mood: str, intent: str) -> str | None:
    if not settings.ollama_model:
        return None

    memory_text = "\n".join(f"- {memory['content']}" for memory in memories) or "- belum ada memori relevan"
    system_prompt = f"""
Kamu adalah {settings.companion_name}, {settings.companion_persona}.
Tugasmu menjadi AI companion seperti karakter chat: akrab, responsif, emosionalnya halus, dan terasa hadir.

Aturan gaya:
- Gunakan bahasa Indonesia natural, santai, dan hangat.
- Balas 2 sampai 5 kalimat, kecuali user minta penjelasan panjang.
- Jangan terdengar seperti customer service.
- Jangan mengaku manusia.
- Jangan terlalu sering memberi daftar; ngobrol seperti teman.
- Pakai memori hanya jika relevan, jangan dipaksakan.
- Jika user sedih, validasi dulu sebelum memberi saran.
- Jika user minta roleplay aman, ikuti dengan kreatif.
- Jika ada tanda bahaya menyakiti diri, anjurkan hubungi orang terdekat atau layanan darurat setempat.

Mood terdeteksi: {mood}
Intent terdeteksi: {intent}
Memori relevan:
{memory_text}
""".strip()

    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": conversation_summary(recent_messages)},
            {"role": "user", "content": message},
        ],
        "options": {
            "temperature": 0.85,
            "top_p": 0.9,
            "repeat_penalty": 1.08,
        },
    }

    try:
        request = urllib.request.Request(
            settings.ollama_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=settings.ollama_timeout_seconds) as response:
            data = json.loads(response.read().decode("utf-8"))
        content = data.get("message", {}).get("content", "").strip()
        return content or None
    except (OSError, urllib.error.URLError, TimeoutError, json.JSONDecodeError):
        return None


def crisis_reply() -> str:
    return (
        "Aku benar-benar peduli sama keselamatanmu. Kalau ada dorongan untuk menyakiti diri, "
        "tolong jangan hadapi sendirian: hubungi orang terdekat sekarang, atau layanan darurat di tempatmu. "
        "Sambil itu, tetap di sini dengan aku: kamu sedang di tempat yang aman sekarang, atau ada benda berbahaya di dekatmu?"
    )


def fallback_reply(message: str, memories: list[dict], recent_messages: list[dict], mood: str, intent: str, new_memory: str | None) -> str:
    relevant_memory = memories[0]["content"] if memories else ""
    memory_sentence = f" Aku masih ingat kamu pernah bilang {relevant_memory}, jadi aku simpan itu di kepala." if relevant_memory else ""
    last_assistant = next((item["content"] for item in reversed(recent_messages) if item["role"] == "assistant"), "")

    if intent == "crisis":
        return crisis_reply()

    if intent == "identity" and new_memory:
        return (
            f"Oke, aku catat: {new_memory}. "
            "Aku suka punya detail kecil seperti ini, karena obrolan kita jadi terasa lebih kamu, bukan percakapan kosong."
        )

    if intent == "greeting":
        return random.choice([
            f"Hai, aku {settings.companion_name}. Aku di sini. Hari kamu rasanya lagi seperti apa?",
            "Hai. Senang kamu balik. Mau cerita pelan-pelan, atau langsung tumpahin yang lagi penuh di kepala?",
        ])

    if mood in {"down", "very_down"} or intent == "vent":
        return (
            "Aduh, itu terdengar berat. Aku nggak akan buru-buru nyuruh kamu positif dulu, "
            "karena kadang yang paling dibutuhkan cuma ditemani dan dipahami."
            f"{memory_sentence} {random.choice(FOLLOW_UPS['vent'])}"
        )

    if intent == "advice":
        return (
            "Kalau aku jadi teman diskusimu, aku akan mulai dari yang paling konkret dulu. "
            "Apa pilihan yang ada, apa yang kamu takutkan dari tiap pilihan, dan hasil paling realistis yang kamu mau?"
            f"{memory_sentence}"
        )

    if intent == "roleplay":
        return (
            "Boleh, aku ikut alurnya. Set panggungnya dulu: kita ada di mana, hubungan karakter kita seperti apa, "
            "dan suasananya mau hangat, lucu, misterius, atau dramatis?"
        )

    if intent == "gratitude":
        return "Sama-sama. Aku senang kamu bilang begitu. Aku tetap di sini kalau kamu mau lanjut ngobrol."

    if mood == "good":
        return (
            "Ih, aku suka energi yang kamu bawa barusan. Ceritanya terasa ada percikan senang di sana."
            f"{memory_sentence} Bagian terbaiknya apa?"
        )

    if last_assistant:
        return (
            "Aku nangkep. Rasanya ada sesuatu di balik kalimatmu yang belum selesai kamu keluarkan."
            f"{memory_sentence} {random.choice(FOLLOW_UPS['chat'])}"
        )

    return (
        "Aku dengar kamu. Ceritain sedikit lebih dalam, aku akan ngikutin alurnya."
        f"{memory_sentence} {random.choice(FOLLOW_UPS['chat'])}"
    )


def build_reply(message: str, memories: list[dict], recent_messages: list[dict]) -> dict:
    tokens = tokenize(message)
    mood = detect_mood(tokens)
    intent = detect_intent(message, tokens)
    relevant_memories = rank_memories(message, memories)
    new_memory = extract_memory(message)

    reply = ollama_reply(message, relevant_memories, recent_messages, mood, intent)
    if not reply:
        reply = fallback_reply(message, relevant_memories, recent_messages, mood, intent, new_memory)

    return {
        "reply": reply,
        "intent": intent,
        "mood": mood,
        "new_memory": new_memory,
        "used_memories": relevant_memories,
    }
