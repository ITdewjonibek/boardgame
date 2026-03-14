"""
Seed script for all game questions
Runs once to populate database with questions for all subjects
"""

import sys
import os
sys.path.insert(0, 'c:/react Jonibek/vite-project')
os.chdir('c:/react Jonibek/vite-project/Uzgame')

from app.database import sessionlocal, Base, engine
from app.models.game import GameQuestion
from sqlalchemy import delete

# Create tables first
Base.metadata.create_all(bind=engine)

# Initialize database session
db = sessionlocal()

# Delete existing questions
db.execute(delete(GameQuestion))
db.commit()

# All questions for all games
ALL_QUESTIONS = {
    "mathematics": {
        "Oson": [
            {"q": "2 + 3 = ?", "opts": ["3", "4", "5", "6"], "correct": 2, "section": 1},
            {"q": "10 - 5 = ?", "opts": ["3", "4", "5", "6"], "correct": 2, "section": 1},
            {"q": "4 × 2 = ?", "opts": ["6", "8", "10", "12"], "correct": 1, "section": 1},
            {"q": "20 ÷ 4 = ?", "opts": ["3", "4", "5", "6"], "correct": 1, "section": 1},
            {"q": "5² = ?", "opts": ["20", "25", "30", "35"], "correct": 1, "section": 1},
            {"q": "√16 = ?", "opts": ["2", "3", "4", "5"], "correct": 2, "section": 1},
            {"q": "15 + 25 = ?", "opts": ["35", "40", "45", "50"], "correct": 2, "section": 1},
            {"q": "100 - 30 = ?", "opts": ["60", "65", "70", "75"], "correct": 0, "section": 1},
            {"q": "3 × 7 = ?", "opts": ["18", "21", "24", "27"], "correct": 1, "section": 1},
            {"q": "144 ÷ 12 = ?", "opts": ["10", "11", "12", "13"], "correct": 2, "section": 1},
        ],
        "O'rta": [
            {"q": "x² + 2x + 1 = (x + 1)² ni isbotlang", "opts": ["To'g'ri", "Noto'g'ri", "Shartli", "Hech bir"], "correct": 0, "section": 1},
            {"q": "2x + 5 = 13, x = ?", "opts": ["3", "4", "5", "6"], "correct": 1, "section": 1},
            {"q": "Uchburchak burchaklari yig'indisi?", "opts": ["90°", "180°", "270°", "360°"], "correct": 1, "section": 1},
            {"q": "sin(90°) = ?", "opts": ["0", "0.5", "1", "-1"], "correct": 2, "section": 1},
            {"q": "cos(0°) = ?", "opts": ["0", "0.5", "1", "-1"], "correct": 2, "section": 1},
            {"q": "log₁₀(100) = ?", "opts": ["1", "2", "3", "4"], "correct": 1, "section": 1},
            {"q": "e ≈ ?", "opts": ["2.18", "2.78", "2.98", "3.18"], "correct": 1, "section": 1},
            {"q": "π ≈ ?", "opts": ["2.14", "3.14", "4.14", "5.14"], "correct": 1, "section": 1},
            {"q": "Binomial formula nma?", "opts": ["(a+b)²=a²+b²", "(a+b)²=a²+2ab+b²", "(a+b)²=ab", "Yana bu"], "correct": 1, "section": 1},
            {"q": "Determinant (2×2) matritsa: |1 2|; |3 4| = ?", "opts": ["-2", "-1", "0", "1"], "correct": 0, "section": 1},
        ],
        "Qiyin": [
            {"q": "∫x² dx = ?", "opts": ["x³", "x³/3 + C", "x³/2 + C", "2x³ + C"], "correct": 1, "section": 1},
            {"q": "lim(x→0) sin(x)/x = ?", "opts": ["0", "0.5", "1", "∞"], "correct": 2, "section": 1},
            {"q": "Taylor seriyasi e^x = ?", "opts": ["Σ(x^n)/n!", "Σ(x^n)/n", "Σ(nx^n)", "Σ(x^n)"], "correct": 0, "section": 1},
            {"q": "Kovalevskaya teoremasi?", "opts": ["O'zgaruvchilar", "Differensial tenglamalar", "Integrallar", "Analitiklik"], "correct": 1, "section": 1},
            {"q": "Fourier seriyasining maqsadi?", "opts": ["Funktsiyani qatlam qilish", "Trigonometrik funktsiyaga yoyish", "Koeffitsiyentlarni topish", "Energiya"], "correct": 1, "section": 1},
            {"q": "Kompleks sonning moduli |a+bi| = ?", "opts": ["a+b", "√(a²+b²)", "a²+b²", "ab"], "correct": 1, "section": 1},
            {"q": "Qo'shumcha matritsaning (adjugate) ta'rifi?", "opts": ["Transponentsiyalangan kofaktor", "Determinant", "Inversiya", "Diagonal"], "correct": 0, "section": 1},
            {"q": "Laplace transformatsiyasi L{f(t)} = ?", "opts": ["∫₀^∞ f(t)e^st dt", "∫₀^∞ f(t)e^(-st) dt", "∫₋∞^∞ f(t)e^(-st) dt", "Σ f(t)e^(-st)"], "correct": 1, "section": 1},
            {"q": "Stoks teoremasi nima?", "opts": ["Sirtni chegaralash", "Vektor maydonni chiqarish", "Integral va differensial munosabati", "Eneriya"], "correct": 2, "section": 1},
            {"q": "Runge-Kutta 4-chi tartibining xususiyati?", "opts": ["O'h⁴ aniqlik", "O'h⁵ aniqlik", "O'h³ aniqlik", "Chiziqli"], "correct": 0, "section": 1},
        ]
    },
    "physics": {
        "Oson": [
            {"q": "F = ma bo'yicha, agar m=5kg, a=2m/s² bo'lsa F nima?", "opts": ["5 N", "10 N", "7 N", "15 N"], "correct": 1, "section": 1},
            {"q": "Tezlik formulasi qaysi?", "opts": ["v = s/t", "v = a/t", "v = m/t", "v = F/t"], "correct": 0, "section": 1},
            {"q": "Energiya SI birligida nima deyiladi?", "opts": ["Kilojoule", "Joul", "Vatt", "Kat"], "correct": 1, "section": 1},
            {"q": "Og'irlik tezlanuvi g ni qiymatini toping", "opts": ["5.8 m/s²", "9.8 m/s²", "12.3 m/s²", "7.5 m/s²"], "correct": 1, "section": 1},
            {"q": "Moddaning og'irligi P = ?", "opts": ["P = m/g", "P = m × g", "P = g/m", "P = m + g"], "correct": 1, "section": 1},
            {"q": "Harorat birligini toping", "opts": ["Vatt", "Joul", "Kelvin", "Newton"], "correct": 2, "section": 1},
            {"q": "Zichlik formulasi nima?", "opts": ["ρ = m/V", "ρ = V/m", "ρ = m + V", "ρ = m - V"], "correct": 0, "section": 1},
            {"q": "Bosim formulasi qaysi?", "opts": ["P = F/S", "P = F × S", "P = S/F", "P = F + S"], "correct": 0, "section": 1},
            {"q": "Murakkab harakatda tezlikni toping", "opts": ["v = a × t", "v = v0 + at", "v = s × t", "v = g × t"], "correct": 1, "section": 1},
            {"q": "Masofani toping: t=3s, a=2m/s²", "opts": ["3 m", "6 m", "9 m", "12 m"], "correct": 2, "section": 1},
        ],
        "O'rta": [
            {"q": "Kuch va tezlanish orasidagi munosabat?", "opts": ["Teskari", "To'g'ri", "Aylana", "Chunqi"], "correct": 1, "section": 1},
            {"q": "Joul-Lents qonuni nima?", "opts": ["Q = I²Rt", "Q = IRt", "Q = I/Rt", "Q = I + Rt"], "correct": 0, "section": 1},
            {"q": "Magnit maydonining SI birligi?", "opts": ["Ampere", "Tesla", "Veber", "Farad"], "correct": 1, "section": 1},
            {"q": "Fotoni energiyasi E = ?", "opts": ["E = hf", "E = hv", "E = h/f", "E = f/h"], "correct": 0, "section": 1},
            {"q": "Reliatyvistik massa nima?", "opts": ["m' = m × c", "m' = m/√(1-v²/c²)", "m' = m × v", "m' = m/c"], "correct": 1, "section": 1},
            {"q": "Elektromagnit indu'ksiya qonuni?", "opts": ["ε = -dΦ/dt", "ε = Φ/t", "ε = dΦ/dt", "ε = Φ × t"], "correct": 0, "section": 1},
            {"q": "Termodinamikaning 1-qonuni?", "opts": ["dU = dQ + dW", "dU = dQ - dW", "U = Q + W", "U = Q/W"], "correct": 1, "section": 1},
            {"q": "Entropiya ta'rifi nma?", "opts": ["Issi", "Tartibsizlik", "Energiya", "Kuch"], "correct": 1, "section": 1},
            {"q": "Snell qonuni nma?", "opts": ["n₁sin(θ₁) = n₂sin(θ₂)", "n₁/sin(θ₁) = n₂/sin(θ₂)", "n₁ + sin(θ₁) = n₂ + sin(θ₂)", "sin(θ₁) = sin(θ₂)"], "correct": 0, "section": 1},
            {"q": "Dopler effekti tezlikda?", "opts": ["f' = f(v+v_s)/v", "f' = f·v/(v+v_s)", "f' = f(v-v_s)/v", "f' = f + v_s"], "correct": 0, "section": 1},
        ],
        "Qiyin": [
            {"q": "Shrodin'jer tenglamasi nima?", "opts": ["iℏ ∂ψ/∂t = Ĥψ", "E = mc²", "F = ma", "P = F/S"], "correct": 0, "section": 1},
            {"q": "Bohr modeli elektron energiyasi?", "opts": ["E = 13.6/n² eV", "E = mc²", "E = hf", "E = kT"], "correct": 0, "section": 1},
            {"q": "Maxwell tenglamalari soni?", "opts": ["2", "3", "4", "5"], "correct": 2, "section": 1},
            {"q": "Kvant detallar qo'shilish prinsipi?", "opts": ["Klassik", "Superpositsiya", "Entanglement", "Klassik+Kvant"], "correct": 1, "section": 1},
            {"q": "Pauli ta'qiqlanish prinsipi?", "opts": ["Ikkita elektron xuddi shunga", "Elektronlar spin", "Orbitalar", "Energiya darjalari"], "correct": 0, "section": 1},
            {"q": "Heisenberg noaniqlik prinsipi?", "opts": ["Δx·Δp ≥ ℏ/2", "Δx·Δp = ℏ", "Δx·Δp ≤ ℏ", "Δx + Δp = ℏ"], "correct": 0, "section": 1},
            {"q": "Renormalizatsiya nmadir?", "opts": ["Cheksizliklarni hayjani", "Yonov", "Spektr", "Klassik limit"], "correct": 0, "section": 1},
            {"q": "Ikkita relyativistik zarrali?", "opts": ["Klassik", "Dirac tenglamasi", "Klein-Gordon", "Pauli tenglamasi"], "correct": 1, "section": 1},
            {"q": "Gauge invariantsiya nma?", "opts": ["Kuch", "Simetriya", "Energiya", "Vaqt"], "correct": 1, "section": 1},
            {"q": "Standard Model nechta kvark turi?", "opts": ["4", "5", "6", "7"], "correct": 2, "section": 1},
        ]
    },
    "chemistry": {
        "Oson": [
            {"q": "H₂O nima?", "opts": ["Gaz", "Suv", "Metall", "Organik birlasma"], "correct": 1, "section": 1},
            {"q": "NaCl nima?", "opts": ["Shakar", "Tuz", "Yog'", "Oqsilik"], "correct": 1, "section": 1},
            {"q": "O₂ nima?", "opts": ["Vodorod", "Karbon", "Kislorod", "Nitrog'en"], "correct": 2, "section": 1},
            {"q": "CO₂ qaysi juda?", "opts": ["Oqsilik", "Asos", "Tuz", "Metalloid"], "correct": 0, "section": 1},
            {"q": "Daraja 1-8 to'plam qalay?", "opts": ["Metal", "Gayz", "Metalloid", "Noorganski"], "correct": 1, "section": 1},
            {"q": "K+Cl → ?", "opts": ["KCl", "K₂Cl", "KCl₂", "K₃Cl"], "correct": 0, "section": 1},
            {"q": "Qaysi yaqqol biriknish?", "opts": ["Kovalent", "Ionik", "Metallik", "Vodorod"], "correct": 1, "section": 1},
            {"q": "HCl reaktsiyon?", "opts": ["Asos", "Juda", "Tuz", "Suv"], "correct": 1, "section": 1},
            {"q": "pH tezligi? (Asos)", "opts": ["< 7", "= 7", "> 7", "0"], "correct": 2, "section": 1},
            {"q": "Atom faqat quyida?", "opts": ["Nuklei", "Elektronlar", "Protonlar", "Netronlar"], "correct": 0, "section": 1},
        ],
        "O'rta": [
            {"q": "CuSO₄ + Fe → ?", "opts": ["FeSO₄ + Cu", "Fe₂SO₄", "Cu₂SO₄", "FeCu"], "correct": 0, "section": 1},
            {"q": "Oksidatsyon raqami Fe in FeCl₃?", "opts": ["+1", "+2", "+3", "-3"], "correct": 2, "section": 1},
            {"q": "C₂H₅OH nima?", "opts": ["Metanol", "Etanol", "Propanol", "Butanol"], "correct": 1, "section": 1},
            {"q": "CH₄ + 2O₂ → ?", "opts": ["CO₂ + H₂O", "C + H₂O", "CO + H₂", "C₂O + H₂O"], "correct": 0, "section": 1},
            {"q": "Kaliy (K) reaktsiyon suv bilan?", "opts": ["Oz", "Zo'r", "Beqarortaш", "Yo'q"], "correct": 1, "section": 1},
            {"q": "Lewis tuzulishi He?", "opts": ["He:", ":He:", "He", "(:He:)"], "correct": 2, "section": 1},
            {"q": "Polimer bu?", "opts": ["Kichik molekula", "Katta zanjir", "Tuz", "Gaz"], "correct": 1, "section": 1},
            {"q": "Esterifikatsiya reaktsiyon?", "opts": ["Alkol + Zanj", "Alkol + Karbon", "Alkol + Kislota", "Gaz + Shum"], "correct": 2, "section": 1},
            {"q": "Molar massa H₂SO₄?", "opts": ["80 g/mol", "96 g/mol", "98 g/mol", "100 g/mol"], "correct": 2, "section": 1},
            {"q": "Qaysi element nonmetal?", "opts": ["Na", "Fe", "O", "Ca"], "correct": 2, "section": 1},
        ],
        "Qiyin": [
            {"q": "Le Chatelier prinsipi?", "opts": ["Tuzilma to'g'rilligi", "Tengazoqlanish qaytarish", "Jonlashtirish", "Katalizator ta'siri"], "correct": 1, "section": 1},
            {"q": "Gibbs energiya G < 0?", "opts": ["Endotermik", "Spontan", "Revesibel", "Qolgan"], "correct": 1, "section": 1},
            {"q": "pOH + pH = ?", "opts": ["7", "10", "14", "0"], "correct": 2, "section": 1},
            {"q": "Rate law [A]¹[B]² reaction order?", "opts": ["1", "2", "3", "0"], "correct": 2, "section": 1},
            {"q": "Activation energy (Ea) bosilgan?", "opts": ["Katalizator ortiradi", "Katalizator kamaydi", "Temp ortiradi", "Conc kamaydi"], "correct": 1, "section": 1},
            {"q": "Electroliz Cu electrode'da?", "opts": ["O₂", "Cl₂", "Cu", "H₂"], "correct": 2, "section": 1},
            {"q": "Redox reaktsiyon: MnO₄⁻ → Mn²⁺, change in oxidation?", "opts": ["+1 → +3", "+7 → +2", "+5 → +3", "-1 → -3"], "correct": 1, "section": 1},
            {"q": "Coordinate covalent bond?", "opts": ["Normal bonding", "Donor-Acceptor", "Ionic", "Metallic"], "correct": 1, "section": 1},
            {"q": "Keto-enol tautomerism?", "opts": ["Konformizm", "Izomerism", "Polimerizm", "Allotropi"], "correct": 1, "section": 1},
            {"q": "Van der Waals forces qaysi eng zayif?", "opts": ["Ionic", "Covalent", "Hydrogen bond", "Dispersion"], "correct": 3, "section": 1},
        ]
    },
    "history": {
        "Oson": [
            {"q": "O'zbekiston mustaqil bo'lgan yil?", "opts": ["1989", "1990", "1991", "1992"], "correct": 2, "section": 1},
            {"q": "Amir Temur kimdir?", "opts": ["Buyuk polkovnik", "Muallif", "Falsafachi", "Astronomi"], "correct": 0, "section": 1},
            {"q": "Samarqand qaysi davlatda?", "opts": ["Rossiya", "O'zbekiston", "Qozog'iston", "Turkmaniston"], "correct": 1, "section": 1},
            {"q": "Buyuk ipak yo'li qayerdan boshlanadi?", "opts": ["Xitoy", "O'zbekiston", "Rossiya", "Hindiston"], "correct": 0, "section": 1},
            {"q": "Musulmon dinini kim kurgan?", "opts": ["Yusuf", "Muhammad", "Isa", "Musa"], "correct": 1, "section": 1},
            {"q": "Qo'qon qonligi qaysi yil imzolandi?", "opts": ["1873", "1875", "1877", "1879"], "correct": 1, "section": 1},
            {"q": "O'zbekiston Prezidenti?", "opts": ["Shavkat Mirziyoyev", "Islam Karimov", "Amir Temur", "Tamerlan"], "correct": 0, "section": 1},
            {"q": "Xiva xonligi qachon imzolandi?", "opts": ["1873", "1875", "1877", "1880"], "correct": 0, "section": 1},
            {"q": "Fido'qor shahri Andijon?", "opts": ["To'g'ri", "Noto'g'ri", "Bilimsiz", "Qisman"], "correct": 0, "section": 1},
            {"q": "Ibn Sino qaysi yozuvchidir?", "opts": ["Arab", "Fors", "O'zbek", "Turk"], "correct": 1, "section": 1},
        ],
        "O'rta": [
            {"q": "Timuridlar davlati qachon boshlanadi?", "opts": ["1336", "1369", "1404", "1500"], "correct": 1, "section": 1},
            {"q": "Muhammad Horazmiy kim?", "opts": ["Mudeer", "Buyuk matematikchi", "Voyaga etmagan", "Ommaviy shaxs"], "correct": 1, "section": 1},
            {"q": "Andijon va Farg'ona qaysi eri?", "opts": ["Sharq", "Qoraqalpog'iston", "Surqondarya", "Farg'ona"], "correct": 3, "section": 1},
            {"q": "Buyuk Silk Road o'z nomi qa?", "opts": ["Vosita", "Mahsulot", "Ipak", "Pul"], "correct": 2, "section": 1},
            {"q": "Boshlang'ich mustaqillik yil?", "opts": ["1990", "1991", "1992", "1993"], "correct": 1, "section": 1},
            {"q": "Toshkent qaysi yil poytaxt?", "opts": ["1865", "1925", "1950", "1991"], "correct": 0, "section": 1},
            {"q": "Qashqadarya qaysi shahar?", "opts": ["Samarqand", "Qarshi", "Buxoro", "Xiva"], "correct": 1, "section": 1},
            {"q": "Romiy imperiya o'z nomi?", "opts": ["Oktavian", "Cezar", "Pompey", "Marin"], "correct": 1, "section": 1},
            {"q": "Firdavsi qaysi she'ir yozgan?", "opts": ["Guliston", "Buston", "Shahname", "Evegeni"], "correct": 2, "section": 1},
            {"q": "Sho'nobayni qaysibiri poytaxt?", "opts": ["Buxoro", "Samarqand", "Tashkent", "Xiva"], "correct": 0, "section": 1},
        ],
        "Qiyin": [
            {"q": "Acheminid imperiyasi qachon?", "opts": ["500-400 BC", "550-330 BC", "600-500 BC", "450-350 BC"], "correct": 1, "section": 1},
            {"q": "Alexander the Great O'zbekistonga?", "opts": ["329 BC", "330 BC", "328 BC", "327 BC"], "correct": 0, "section": 1},
            {"q": "Kushan imperiyasi ishlahi?", "opts": ["50-250 AD", "100-300 AD", "150-350 AD", "200-400 AD"], "correct": 1, "section": 1},
            {"q": "Samanid davlati markazidir?", "opts": ["Buxoro", "Samarqand", "Ispijo", "Bukhara"], "correct": 0, "section": 1},
            {"q": "Karakhaniylar ishlahi?", "opts": ["819-1212", "900-1100", "950-1220", "1000-1200"], "correct": 2, "section": 1},
            {"q": "Seljuk davlatida buyuk vizir?", "opts": ["Nizam al-Mulk", "Seljuk Bey", "Alp Arslan", "Malik Shah"], "correct": 0, "section": 1},
            {"q": "Qara-Qitaylar qachon?", "opts": ["1000-1125", "1050-1150", "1124-1218", "1100-1200"], "correct": 2, "section": 1},
            {"q": "Khwarezm Shah 1077?", "opts": ["Anushtegin", "Qutbiddin", "Takash", "Muhammad Horazmiy"], "correct": 0, "section": 1},
            {"q": "Chingiz Khan Bukhoro?", "opts": ["1219", "1220", "1221", "1222"], "correct": 0, "section": 1},
            {"q": "Timur Lang qachon tug'ilgan?", "opts": ["1335", "1336", "1337", "1338"], "correct": 1, "section": 1},
        ]
    },
    "geography": {
        "Oson": [
            {"q": "O'zbekiston qaysi kontinentda?", "opts": ["Afrika", "Aziya", "Yevrop", "Amerika"], "correct": 1, "section": 1},
            {"q": "O'zbekiston poytaxti?", "opts": ["Samarqand", "Toshkent", "Buxoro", "Xorazm"], "correct": 1, "section": 1},
            {"q": "O'zbekiston qay shahar katta?", "opts": ["Andijan", "Toshkent", "Namangan", "Kokand"], "correct": 1, "section": 1},
            {"q": "Amu Darya qaysi daryodir?", "opts": ["Muhor", "Uzun", "Qisqa", "Doyim"], "correct": 1, "section": 1},
            {"q": "O'zbek cho'l nomi?", "opts": ["Savoy", "Kyzyl-Kum", "Usturt", "Fergona"], "correct": 1, "section": 1},
            {"q": "O'zbekiston qay mamlakatga chegara?", "opts": ["Qozog'iston", "Turkmaniston", "Afgoniston", "Xitoy"], "correct": 2, "section": 1},
            {"q": "Farg'ona vodiysi qaysi davlatda?", "opts": ["Tadjikiston", "Qirg'iziston", "O'zbekiston", "Barchasi"], "correct": 3, "section": 1},
            {"q": "Aral dengizi qay mamlakatda?", "opts": ["O'zbekiston", "Qozog'iston", "Turkmaniston", "Ikkalasi"], "correct": 3, "section": 1},
            {"q": "Tashkent miqyosi?", "opts": ["250 km", "300 km", "350 km", "400 km"], "correct": 2, "section": 1},
            {"q": "O'zbekiston hududining kattoligi?", "opts": ["440,660 km²", "447,400 km²", "450,000 km²", "455,000 km²"], "correct": 1, "section": 1},
        ],
        "O'rta": [
            {"q": "Farg'ona vodiysi maydoni?", "opts": ["55,900 km²", "60,000 km²", "65,000 km²", "70,000 km²"], "correct": 0, "section": 1},
            {"q": "Zeravshan daryosi qaysi yo'nalishda?", "opts": ["Shimoliy", "Janubiy", "Sharqiy", "G'arbiy"], "correct": 2, "section": 1},
            {"q": "Qoraqalpog'iston qaysi hududda?", "opts": ["Shimol", "Janub", "Sharq", "G'arb"], "correct": 0, "section": 1},
            {"q": "Buxoro viloyati markazidir?", "opts": ["Samarqand", "Buxoro", "Qorshi", "Nasaf"], "correct": 1, "section": 1},
            {"q": "Samarqand shahri yoshini?", "opts": ["2500 yil", "2700 yil", "2800 yil", "3000 yil"], "correct": 1, "section": 1},
            {"q": "Kyzyl-Kum cho'li qaysi viloyatda?", "opts": ["Buxoro", "Xorazm", "Qashqadarya", "Barchasi"], "correct": 3, "section": 1},
            {"q": "Chimboy qaysi viloyatda?", "opts": ["Karakalpakistan", "Xorazm", "Buxoro", "Jizzax"], "correct": 0, "section": 1},
            {"q": "Nuratau tog'lari qay yo'nalishda?", "opts": ["Shimol", "Janub", "Sharq", "G'arb"], "correct": 1, "section": 1},
            {"q": "Syr-Darya daryosi uzunligi?", "opts": ["1800 km", "2100 km", "2400 km", "2700 km"], "correct": 1, "section": 1},
            {"q": "Xoresm sohati qaysi sanoatga asoslanadi?", "opts": ["Maishiy", "Qishloq", "Kimyo", "Energetika"], "correct": 3, "section": 1},
        ],
        "Qiyin": [
            {"q": "O'zbekistonning eng baland cho'qqi?", "opts": ["4648 m", "4657 m", "4662 m", "4700 m"], "correct": 1, "section": 1},
            {"q": "Fergona vodiysi ahalollari?", "opts": ["400-500 m", "600-700 m", "800-900 m", "1000-1100 m"], "correct": 0, "section": 1},
            {"q": "Aral dengizi buziluv sababi?", "opts": ["Qurung", "Iqlim", "Suv", "Sayyoraviy"], "correct": 2, "section": 1},
            {"q": "Toshkent shmitasiga qo'llaniladigan geo-koordinatalar?", "opts": ["41°N 69°E", "42°N 70°E", "40°N 68°E", "43°N 71°E"], "correct": 0, "section": 1},
            {"q": "O'zbekiston qancha foizni min'erallarga bogliq?", "opts": ["25%", "40%", "55%", "70%"], "correct": 1, "section": 1},
            {"q": "Tuyoqtan yog'ga bo'g'liq viloyatlar?", "opts": ["Buxoro", "Qashqadarya", "Ikkalasi", "Hech bir"], "correct": 2, "section": 1},
            {"q": "Ustyurt platosi balandligi?", "opts": ["200 m", "300 m", "400 m", "500 m"], "correct": 2, "section": 1},
            {"q": "O'zbekistonning etnikasi qancha?", "opts": ["90% Uzbek", "85% Uzbek", "95% Uzbek", "80% Uzbek"], "correct": 0, "section": 1},
            {"q": "Kohdiravaio markazi qay shaharda?", "opts": ["Xamsa", "Namangan", "Andijon", "Qoqon"], "correct": 1, "section": 1},
            {"q": "Surxondarya daryosi uzunligi O'zbekistonda?", "opts": ["400 km", "500 km", "600 km", "700 km"], "correct": 1, "section": 1},
        ]
    },
    "biology": {
        "Oson": [
            {"q": "Qaysi organellа energiyani ishlab chiqaradi?", "opts": ["Nucleus", "Mitochondria", "Chloroplast", "Lysosome"], "correct": 1, "section": 1},
            {"q": "Qandaysilar fotosinтez qiladi?", "opts": ["Mitochondria", "Ribosome", "Chloroplast", "Golgi"], "correct": 2, "section": 1},
            {"q": "Asosiy hayot sharti?", "opts": ["Qorosh", "Suv", "Oxygen", "Yorug'lik"], "correct": 1, "section": 1},
            {"q": "Engil organ tishigi?", "opts": ["Qon", "O'pka", "Qolbiliq", "Buyin"], "correct": 1, "section": 1},
            {"q": "Kiyi qismiga nima borasida?", "opts": ["Derma", "Epidermis", "Hypodermis", "Barchasi"], "correct": 3, "section": 1},
            {"q": "Qaysi hujayra turi yo'q?", "opts": ["Hayvon", "O'simlik", "Jarangil", "Bakteri"], "correct": 3, "section": 1},
            {"q": "DNK nima uchun javobgar?", "opts": ["Energiya", "Varislashish", "Fotosinтez", "O'zaro"], "correct": 1, "section": 1},
            {"q": "Genetik kod sandi?", "opts": ["2 nukleotid", "3 nukleotid", "4 nukleotid", "5 nukleotid"], "correct": 1, "section": 1},
            {"q": "Belki qaysiga bo'linadi?", "opts": ["Uglevod", "Lemma", "Amino asidlar", "Lipidlar"], "correct": 2, "section": 1},
            {"q": "Hemoglobin roli?", "opts": ["Nutrient", "Oxygen tashish", "Energiya", "Himoya"], "correct": 1, "section": 1},
        ],
        "O'rta": [
            {"q": "Merez sistemi nemadir?", "opts": ["Qon quvvatiga", "Nerv tizimi", "Gormonal sistema", "Irnaq"], "correct": 2, "section": 1},
            {"q": "Fotosintez formulasi?", "opts": ["6CO₂+6H₂O→C₆H₁₂O₆+6O₂", "C₆H₁₂O₆→2C₂H₅OH+2CO₂", "O₂+C₆H₁₂O₆→CO₂+H₂O", "C+O₂→CO₂"], "correct": 0, "section": 1},
            {"q": "Respiratsiya oxiri?", "opts": ["Glykoliz", "Krebs tsikl", "Elektronlar zanjiri", "Fermentatsiya"], "correct": 2, "section": 1},
            {"q": "Hayvan jinsi nemasida?", "opts": ["Mitosis", "Meyosis", "Amitosis", "Kejs"], "correct": 1, "section": 1},
            {"q": "O'simlik hujayralarida nima bor?", "opts": ["Soentrozoma", "Vakuola", "Sentrosom", "Centriole"], "correct": 1, "section": 1},
            {"q": "Qaysi hormon o'smani regulyatsiya?", "opts": ["Insulin", "Tiroxin", "Growth hormone", "Adrenaline"], "correct": 2, "section": 1},
            {"q": "Umurtqali hayvonlar qancha klass?", "opts": ["3", "4", "5", "6"], "correct": 2, "section": 1},
            {"q": "Mantak biomasasi oqsar?", "opts": ["10%", "20%", "50%", "90%"], "correct": 1, "section": 1},
            {"q": "Fiksatsiya qaysida?", "opts": ["Hayvon", "Bacterium", "O'simlik", "Fungi"], "correct": 1, "section": 1},
            {"q": "Simbioz nemadir?", "opts": ["Hamjahon", "Dusmani", "O'zaro foyda", "Emas hech biri"], "correct": 2, "section": 1},
        ],
        "Qiyin": [
            {"q": "Protein strukturasi qancha saviyali?", "opts": ["2", "3", "4", "5"], "correct": 3, "section": 1},
            {"q": "Hardy-Weinberg tenglama?", "opts": ["p+q=1", "p²+2pq+q²=1", "p²=q²", "p=1/q"], "correct": 1, "section": 1},
            {"q": "Framshift mutatsiya nemadir?", "opts": ["Nuk o'zgartirish", "Nukleotid o'chirish", "Kodli o'zgartirish", "Genlar ko'chish"], "correct": 1, "section": 1},
            {"q": "Krebsning atsital-KoA?", "opts": ["Gikolelitik", "Sitrat", "Piruvat", "Suksinate"], "correct": 1, "section": 1},
            {"q": "Fotosistemaning plastochyon?", "opts": ["PSII", "PSI", "O₂ chiqaruvchi", "Ikkala yo'q"], "correct": 2, "section": 1},
            {"q": "Apoptosis bu?", "opts": ["Hujayraning o'limi", "Hujayraning bo'linishi", "Mutatsiya", "Reprodukciya"], "correct": 0, "section": 1},
            {"q": "Genom sekvensiyasi?", "opts": ["mRNK", "tRNK", "DNK", "rRNK"], "correct": 2, "section": 1},
            {"q": "CRISPR-Cas9 nemadir?", "opts": ["Antibiotik", "Gen muharriri", "Protein", "Virus"], "correct": 1, "section": 1},
            {"q": "Epigenетika qanday?", "opts": ["Gen o'zgartirishi", "Gene ekspressiyasi", "Mutatsiya", "Rekombinatsiya"], "correct": 1, "section": 1},
            {"q": "Telomeraza roli?", "opts": ["O'sish", "Telomer berish", "Energiya", "Transkriptsiya"], "correct": 1, "section": 1},
        ]
    },
    "uzbek_language": {
        "Oson": [
            {"q": "Qaysi so'zning ma'nosi \"kitob\"?", "opts": ["Qalam", "Daftar", "Kitob", "Qo'lqalam"], "correct": 2, "section": 1},
            {"q": "\"Men\" so'zining qo'llaniluvchi shakli?", "opts": ["Meni", "Menga", "Mendan", "Meniga"], "correct": 0, "section": 1},
            {"q": "Qaysi so'z ot?", "opts": ["Yozish", "Yozuvchi", "Yozing", "Yozgan"], "correct": 1, "section": 1},
            {"q": "\"Qoshni\" so'zining ma'nosi?", "opts": ["Ko'z", "Qaş", "Yuz", "Uzunroq"], "correct": 1, "section": 1},
            {"q": "Qaysi so'zning sinonymi \"aql\"?", "opts": ["Ong", "Roh", "Jismo", "Qolb"], "correct": 0, "section": 1},
            {"q": "\"Orqu\" so'zining ma'nosi?", "opts": ["Ustun", "Toshqi", "Tana", "Xora"], "correct": 2, "section": 1},
            {"q": "Qaysi so'z feʼl?", "opts": ["Kitob", "Tez", "O'qish", "Yaxshi"], "correct": 2, "section": 1},
            {"q": "\"Tez\" so'zining ma'nosi?", "opts": ["Sekin", "Tez", "Sokin", "Tundayin"], "correct": 1, "section": 1},
            {"q": "Qaysi so'z ta'mir?", "opts": ["Yuzalar", "Yozdi", "Ko'rik", "Qishloq"], "correct": 3, "section": 1},
            {"q": "\"Xabar\" so'zining ma'nosi?", "opts": ["Gapirish", "Bildirrish", "Yalgan", "Hikoya"], "correct": 1, "section": 1},
        ],
        "O'rta": [
            {"q": "Ijodiy hikoya qaysi tur?", "opts": ["Manzura", "Matni", "Bayon", "Gazetasi"], "correct": 2, "section": 1},
            {"q": "Alfavit qancha harf?", "opts": ["28", "29", "30", "31"], "correct": 2, "section": 1},
            {"q": "Qayd o'rni qaernda?", "opts": ["Avtormada", "Boshida", "Ohirida", "O'rtasida"], "correct": 3, "section": 1},
            {"q": "Qaysi so'zning antonimi \"qora\"?", "opts": ["Sariq", "Oq", "Ko'k", "Qizil"], "correct": 1, "section": 1},
            {"q": "Grammatika qaysini o'rganadi?", "opts": ["Xarflar", "Gram tahlili", "Ma'nosi", "Tarixi"], "correct": 1, "section": 1},
            {"q": "So'z shakli qaysi harf bilan?", "opts": ["Bosh", "Kichik", "Qo'llaniladigan", "Hech"], "correct": 2, "section": 1},
            {"q": "Murakkab so'z nemadir?", "opts": ["Bir so'z", "Ikki so'z", "Uch so'z", "Besh so'z"], "correct": 1, "section": 1},
            {"q": "Zamonaviy o'zbek til kim tomonidan?", "opts": ["Davlat", "Xalq", "Alim", "Jami hamma"], "correct": 3, "section": 1},
            {"q": "Korikmalar qanday?", "opts": ["Qisqa", "Uzun", "O'rtacha", "Tursun"], "correct": 1, "section": 1},
            {"q": "Matn qanday bo'ladi?", "opts": ["Kichik", "Katta", "To'liq yoki qisqa", "Tengmasiga"], "correct": 2, "section": 1},
        ],
        "Qiyin": [
            {"q": "Diakritik belgilar nima?", "opts": ["Harflar", "Tog'rigi belgilari", "Uslub belgilari", "Ohang belgilari"], "correct": 3, "section": 1},
            {"q": "Etimologiya qaysini o'rganadi?", "opts": ["Avvali", "Imlo", "So'zning kelib chiqishi", "Lug'ati"], "correct": 2, "section": 1},
            {"q": "Ritorika qaysi fani?", "opts": ["Til fanidan", "Filosofiyadan", "Ijodiylikdan", "Siolyat"], "correct": 0, "section": 1},
            {"q": "Morfema qanday bo'ladi?", "opts": ["Xalqiy", "Kosimli", "Asosiy yoki qo'shimcha", "Mustaqil"], "correct": 2, "section": 1},
            {"q": "Fonema qaysiga farq?", "opts": ["Sadoga", "Imlo", "Til sistemasiga", "Alifboga"], "correct": 2, "section": 1},
            {"q": "Leksika o'rganadi?", "opts": ["Harflarni", "So'zlarni", "Hayollarni", "Hikoyalarni"], "correct": 1, "section": 1},
            {"q": "Pragmatika so'zlashuvning?", "opts": ["Xaqida", "Jarayoni", "Mazmuni", "Konteksti"], "correct": 3, "section": 1},
            {"q": "Sintaksis qaysini o'rganadi?", "opts": ["So'z", "Gap", "Xarflar", "Belgilar"], "correct": 1, "section": 1},
            {"q": "Stilistika qaysini qayd?", "opts": ["Tilning", "Uslublar", "Sotsial", "Tarihiy"], "correct": 1, "section": 1},
            {"q": "Paronomasiya nemadir?", "opts": ["Xuddi shunga", "O'xshashlik", "Faqatlik", "Tavallud"], "correct": 1, "section": 1},
        ]
    }
}

# Insert all questions
def seed_all_questions():
    total = 0
    for game_name, difficulties in ALL_QUESTIONS.items():
        for difficulty, questions_list in difficulties.items():
            for q_data in questions_list:
                question = GameQuestion(
                    game_name=game_name,
                    question_text=q_data["q"],
                    options=q_data["opts"],
                    correct_answer=q_data["correct"],
                    difficulty=difficulty,
                    section_number=q_data.get("section", 1),
                    formula=q_data.get("formula"),
                    explanation=q_data.get("explanation")
                )
                db.add(question)
                total += 1
    db.commit()
    print(f"[OK] Seeded {total} questions successfully!")

if __name__ == "__main__":
    seed_all_questions()
