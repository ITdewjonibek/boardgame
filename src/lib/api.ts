const API = import.meta.env.VITE_API_URL || "/api";

const STORAGE = { sections: "testplay_sections", tests: "testplay_tests", offline: "testplay_offline" };

function isOffline(): boolean {
  return sessionStorage.getItem(STORAGE.offline) === "1";
}

function setOffline() {
  sessionStorage.setItem(STORAGE.offline, "1");
}

const FETCH_TIMEOUT = 5000;

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return data?.status === "ok";
  } catch {
    return false;
  }
}

async function apiFetch(url: string, opts?: RequestInit, skipOffline = false): Promise<Response | null> {
  if (!skipOffline && isOffline()) return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok && !skipOffline) setOffline();
    return res;
  } catch {
    clearTimeout(t);
    if (!skipOffline) setOffline();
    return null;
  }
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

function getLocalSections(): { id: number; game_id: number; name: string; order: number }[] {
  try {
    const s = localStorage.getItem(STORAGE.sections);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function getLocalTests(): { id: number; section_id: number; question: string; options: string[]; correct_index: number }[] {
  try {
    const s = localStorage.getItem(STORAGE.tests);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export async function login(username: string, password: string) {
  try {
    const res = await apiFetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res?.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      return data;
    }
  } catch { }

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("token", "demo-token");
    return { access_token: "demo-token" };
  }
  throw new Error("Login: admin / admin123");
}

export function logout() {
  localStorage.removeItem("token");
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

const DEFAULT_GAMES: Game[] = [
  { id: 1, name: "Baraban", slug: "wheel" },
  { id: 2, name: "Arqon tortish", slug: "tug_of_war" },
  { id: 3, name: "So'z qidiruv", slug: "word_search" },
  { id: 4, name: "Davlatni top", slug: "country" },
  { id: 5, name: "Chempion o'quvchi", slug: "champion" },
  { id: 6, name: "Viktorina", slug: "quiz" },
  { id: 7, name: "Millioner", slug: "millionaire" },
  { id: 8, name: "Xotira o'yini", slug: "memory" },
  { id: 9, name: "Tezkor hisob", slug: "math" },
  { id: 10, name: "So'z topish", slug: "word" },
  { id: 11, name: "Vaqt boshi", slug: "speed_round" },
  { id: 12, name: "Krossvord", slug: "crossword" },
  { id: 13, name: "Kattasini top", slug: "biggest" },
  { id: 14, name: "1v1 Jang", slug: "duel" },
  { id: 15, name: "Savol zanjiri", slug: "chain" },
  { id: 101, name: "Cosmic Quiz", slug: "cosmic-quiz", description: "Koinot testi" },
  { id: 102, name: "Molecular Lab", slug: "molecular-lab", description: "Kimyo lab" },
  { id: 103, name: "Battle of Wits", slug: "battle-of-wits", description: "Matematik duel" },
  { id: 104, name: "Verbal Quest", slug: "verbal-quest", description: "RPG so'z o'yini" },
  { id: 105, name: "Logic Master", slug: "logic-master", description: "Mantiqiy xakerlik" },
];

const SLUG_TO_ID: Record<string, number> = {
  wheel: 1, tug_of_war: 2, word_search: 3, country: 4, champion: 5,
  quiz: 6, millionaire: 7, memory: 8, math: 9, word: 10,
  speed_round: 11, crossword: 12, biggest: 13, duel: 14, chain: 15,
  "cosmic-quiz": 101, "molecular-lab": 102, "battle-of-wits": 103, "verbal-quest": 104, "logic-master": 105,
};

export interface Section {
  id: number;
  name: string;
  order: number;
  game_id: number;
}

export interface Test {
  id: number;
  section_id: number;
  question: string;
  options: string[];
  correct_index: number;
}

export async function fetchGames(): Promise<Game[]> {
  const res = await apiFetch(`${API}/games`);
  if (res?.ok) return res.json();
  return DEFAULT_GAMES;
}

export async function fetchGameSections(slug: string): Promise<Section[]> {
  const res = await apiFetch(`${API}/games/${slug}/sections`);
  if (res?.ok) return res.json();
  const gameId = SLUG_TO_ID[slug] ?? 1;
  return getLocalSections().filter((s) => s.game_id === gameId);
}

export async function fetchGameTests(slug: string): Promise<Test[]> {
  const defaultTests: Test[] = [
    {
      id: 9991, section_id: 1,
      question: "[Mantiqiy Sinov] 1 dan 100 gacha bo'lgan raqamlar yig'indisini aniqlashda qaysi formula eng samarali?",
      options: ["n(n+1)/2", "n^2 + 1", "2n + n", "Factorial(n) / 2"],
      correct_index: 0
    },
    {
      id: 9992, section_id: 1,
      question: "[Tezkor Fikr] Tizim xavfsizligida ehtimoliy xavflarni oldindan baholash jarayoni nima deb nomlanadi?",
      options: ["Risk Assessment", "System Override", "Brute Force", "Data Binding"],
      correct_index: 0
    },
    {
      id: 9993, section_id: 1,
      question: "[Kognitiv] Ikkilik sanoq sistemasida (Binary) 1011 qaysi o'nlik songa teng?",
      options: ["11", "9", "13", "10"],
      correct_index: 0
    }
  ];

  try {
    const res = await apiFetch(`${API}/game-tests/merged/${slug}`);
    if (res?.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const customTests: Test[] = data.map((q: any) => ({
          id: q.id,
          section_id: 1,
          question: `[Qo'shimcha Savol] ${q.prompt}`,
          options: q.options.map((o: any) => o.text),
          correct_index: q.correct_index
        }));
        return [...defaultTests, ...customTests];
      }
    }
  } catch (e) {
    console.error("Merged API Failed, relying strictly on defaults:", e);
  }

  return defaultTests;
}

export async function addSection(gameId: number, name: string, order: number): Promise<Section> {
  const token = getToken();
  if (!token) throw new Error("Kirish kerak");
  const res = await apiFetch(
    `${API}/sections/`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ game_id: gameId, name, order }) },
    true
  );
  if (res?.ok) return res.json();
  throw new Error("Backend ishlamayapti. Database ga saqlash uchun: npm run backend");
}

export async function addTest(
  sectionId: number,
  question: string,
  options: string[],
  correctIndex: number
): Promise<Test> {
  const token = getToken();
  if (!token) throw new Error("Kirish kerak");

  const res = await apiFetch(
    `${API}/tests/`,
    { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ section_id: sectionId, question, options, correct_index: correctIndex }) },
    true
  );
  if (res?.ok) return res.json();
  const err = res ? await res.json().catch(() => ({})) : {};
  throw new Error(typeof err?.detail === "string" ? err.detail : "Backend ishlamayapti. Database ga saqlash: npm run backend");
}

export async function fetchSectionTests(sectionId: number): Promise<Test[]> {
  const res = await apiFetch(`${API}/sections/${sectionId}/tests`);
  if (res?.ok) return res.json();
  return getLocalTests().filter((t) => t.section_id === sectionId);
}
