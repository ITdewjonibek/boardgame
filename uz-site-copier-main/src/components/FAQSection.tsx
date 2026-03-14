import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Intertalim.uz qanday platforma?", a: "Intertalim.uz — ta'limni o'yinlar orqali qiziqarli va samarali qilishga xizmat qiluvchi platforma. Unda o'quvchilar fanlar bo'yicha interaktiv topshiriqlarni bajarib, bilimlarini mustahkamlaydi." },
  { q: "Platformadan kimlar uchun?", a: "Platforma o'quvchilar, o'qituvchilar va ota-onalar uchun mo'ljallangan." },
  { q: "Platformadan foydalanish bepulmi?", a: "Ha, platformadan foydalanish hozirda mutlaqo bepul." },
  { q: "Ro'yxatdan o'tmasdan ham o'yinlarni ishlata olamanmi?", a: "Ha, hozirgi test rejimida platformadagi barcha o'yinlarni ro'yxatdan o'tmasdan ham sinab ko'rishingiz mumkin." },
  { q: "Qaysi fanlar uchun o'yinlar mavjud?", a: "Platformada deyarli barcha asosiy maktab fanlari bo'yicha interaktiv o'yinlar mavjud." },
  { q: "Telefon orqali ham ishlaydimi?", a: "Ha, platforma mobil qurilmalarga moslashtirilgan." },
  { q: "Yangi o'yinlar qachon qo'shiladi?", a: "Platforma muntazam yangilanadi. Yangi o'yinlar va metodlar bosqichma-bosqich qo'shib boriladi." },
];

const FAQSection = () => (
  <section id="faq" className="py-20">
    <div className="container max-w-2xl">
      <div className="text-center mb-12">
        <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">FAQ</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Tez-tez so'raladigan savollar</h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-xl px-5 card-shadow border-none">
            <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
