export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";
export const ASSISTANT_NAME = "Eclps Assistance";

export const starterMessages = [
  {
    role: "assistant",
    content:
      "Hai, aku Eclps Assistance. Aku siap nemenin kamu ngobrol dengan tenang.",
  },
];

export const signals = [
  { label: "Persona", value: ASSISTANT_NAME },
  { label: "Memory", value: "Personal recall" },
  { label: "Tone", value: "Warm companion" },
];

export const tickerWords = [
  "Private Companion",
  "Personal Memory",
  "Mood Reading",
  "Soft Conversation",
  "Context Flow",
  "Calm Interface",
  "Human Tone",
  "Daily Presence",
];

export const interfaceLines = [
  "presence.sync = active",
  "memory.recall = gentle",
  "mood.signal = calm",
  "reply.style = companion",
];

export const orbitMedia = [
  "Companion UI",
  "Mood Signal",
  "Memory Vault",
  "Private Room",
  "Tone Flow",
  "Daily Recall",
  "Soft Reply",
  "Focus Space",
];

export const stickyChapters = [
  {
    id: "presence",
    label: "01",
    eyebrow: "Presence",
    title: "Selalu masuk dengan rasa yang pas.",
    text: "Eclps membaca ritme percakapanmu, lalu menjaga jawaban tetap hangat, jernih, dan tidak terasa kaku.",
    accent: "listening field",
    visualWords: ["pulse", "listen", "presence", "near"],
    layout: "split",
    details: ["Realtime feel", "Gentle reply", "Natural pacing"],
    sheetTitle: "All your companion signals",
    sheetMeta: "Presence calibrated",
    icon: "waves",
    variant: "presence",
  },
  {
    id: "memory",
    label: "02",
    eyebrow: "Memory",
    title: "Mengikat hal penting tanpa membuat obrolan terasa berat.",
    text: "Detail kecil seperti nama, minat, dan kebiasaan bisa muncul kembali saat dibutuhkan, seolah kamu sedang bicara dengan teman yang memperhatikan.",
    accent: "private recall",
    visualWords: ["recall", "notes", "identity", "thread"],
    layout: "reverse",
    details: ["Personal notes", "Soft reminders", "Context thread"],
    sheetTitle: "Inventory of personal context",
    sheetMeta: "Memory arranged",
    icon: "memory",
    variant: "memory",
  },
  {
    id: "mood",
    label: "03",
    eyebrow: "Mood",
    title: "Nada bicara berubah mengikuti suasana.",
    text: "Saat kamu butuh ditemani, dibantu berpikir, atau sekadar didengar, Eclps menyesuaikan respons tanpa kehilangan karakter utamanya.",
    accent: "emotional signal",
    visualWords: ["mood", "tone", "warmth", "soft"],
    layout: "overlay",
    details: ["Tone shift", "Calm support", "Emotional reading"],
    sheetTitle: "Event and emotional emissions",
    sheetMeta: "Tone synchronized",
    icon: "moon",
    variant: "mood",
  },
  {
    id: "private",
    label: "04",
    eyebrow: "Private",
    title: "Ruang obrolan terasa personal dan aman.",
    text: "Percakapan dirancang untuk terasa dekat, rapi, dan terkendali, dengan pengalaman visual yang tenang seperti studio digital premium.",
    accent: "quiet space",
    visualWords: ["local", "quiet", "secure", "space"],
    layout: "stacked",
    details: ["Private room", "Clean focus", "Controlled flow"],
    sheetTitle: "Unit quality and private focus",
    sheetMeta: "Space protected",
    icon: "fingerprint",
    variant: "private",
  },
];

export const qualities = [
  {
    icon: "brain",
    title: "Context aware",
    text: "Membaca percakapan terbaru, mood, dan intent sebelum menjawab.",
  },
  {
    icon: "memory",
    title: "Personal memory",
    text: "Mengingat detail penting seperti nama, minat, dan hal yang kamu minta.",
  },
  {
    icon: "heart",
    title: "Companion tone",
    text: "Dibentuk sebagai teman ngobrol yang hangat, responsif, dan tidak menghakimi.",
  },
];
