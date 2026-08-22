const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();

export const API_URL = configuredApiUrl.replace(/\/+$/, "") || "/api";
export const ASSISTANT_NAME = "ECLPS";

export const starterMessages = [
  {
    id: "starter",
    role: "assistant",
    content: "Hei. Line-nya sudah kebuka — lagi kepikiran apa?",
  },
];

export const signals = [
  { label: "Channel", value: "One-to-one" },
  { label: "Memory", value: "Ready" },
  { label: "Tone", value: "Auto" },
];

export const tickerWords = [
  "Open line",
  "Memory slot",
  "Local first",
  "No judgement",
  "Tone check",
  "After hours",
  "Stay in thread",
  "Real conversation",
];

export const stickyChapters = [
  {
    id: "presence",
    label: "01 / OPEN LINE",
    eyebrow: "Presence",
    title: "Nangkap konteks, bukan cuma kata terakhir.",
    text: "ECLPS mengikuti benang obrolan supaya balasannya nyambung dan nggak terasa seperti mulai dari nol.",
    accent: "Signal locked",
    details: ["Context scan", "Natural pace", "Zero scripts"],
    icon: "radio",
  },
  {
    id: "memory",
    label: "02 / MEMORY SLOT",
    eyebrow: "Memory",
    title: "Hal kecil nggak langsung hilang dari radar.",
    text: "Nama, minat, dan detail yang kamu titipkan bisa dipanggil lagi saat memang relevan.",
    accent: "Recall armed",
    details: ["Personal notes", "Relevant recall", "Thread saved"],
    icon: "database",
  },
  {
    id: "mood",
    label: "03 / TONE DIAL",
    eyebrow: "Read the room",
    title: "Tahu kapan harus bantu. Tahu kapan cukup dengar.",
    text: "Tone menyesuaikan suasana tanpa berubah jadi motivator dadakan atau robot customer service.",
    accent: "Tone synced",
    details: ["Mood check", "Calm support", "No lectures"],
    icon: "sliders",
  },
  {
    id: "private",
    label: "04 / LOCAL MODE",
    eyebrow: "Private",
    title: "Obrolanmu tetap di stack milikmu.",
    text: "Dibangun untuk berjalan lokal, dengan kontrol yang tetap ada di tanganmu — bukan di tab yang entah ke mana.",
    accent: "Local only",
    details: ["Local database", "No public feed", "Full control"],
    icon: "lock",
  },
];

export const qualities = [
  {
    icon: "scan",
    number: "01",
    title: "Tracks the thread",
    text: "Membaca percakapan terbaru, intent, dan mood sebelum menjawab.",
  },
  {
    icon: "database",
    number: "02",
    title: "Keeps your lore",
    text: "Menyimpan detail yang kamu minta dan memanggilnya saat berguna.",
  },
  {
    icon: "shield",
    number: "03",
    title: "Stays on your side",
    text: "Menemani tanpa menghakimi, menggurui, atau mengambil alih obrolan.",
  },
];

export const quickPrompts = [
  "Gue lagi overthinking.",
  "Bantu rapihin ide gue.",
  "Ada cerita random nih.",
];
