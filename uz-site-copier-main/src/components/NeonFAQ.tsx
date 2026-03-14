import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Intertalim.uz qanday platforma?", a: "Intertalim.uz — ta'limni o'yinlar orqali qiziqarli va samarali qilishga xizmat qiluvchi platforma." },
  { q: "Platformadan kimlar foydalanishi mumkin?", a: "O'quvchilar, o'qituvchilar va ota-onalar uchun mo'ljallangan." },
  { q: "Platformadan foydalanish bepulmi?", a: "Ha, platformadan foydalanish hozirda mutlaqo bepul." },
  { q: "Ro'yxatdan o'tmasdan ham ishlata olamanmi?", a: "Ha, barcha o'yinlarni ro'yxatdan o'tmasdan sinab ko'rishingiz mumkin." },
  { q: "Telefon orqali ham ishlaydimi?", a: "Ha, platforma barcha qurilmalarga moslashtirilgan." },
  { q: "Yangi o'yinlar qachon qo'shiladi?", a: "Platforma muntazam yangilanadi. Yangi o'yinlar bosqichma-bosqich qo'shib boriladi." },
];

const NeonFAQ = () => (
  <section id="faq" className="py-24">
    <div className="container max-w-2xl">
      <div className="text-center mb-14">
        <p className="text-sm font-display font-bold text-neon-green uppercase tracking-[0.3em] mb-3">FAQ</p>
        <h2 className="text-3xl md:text-4xl font-display font-black text-foreground">SAVOLLAR</h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="neon-card px-5 border-none">
            <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline hover:text-neon-cyan font-body text-base">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground font-body">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default NeonFAQ;
