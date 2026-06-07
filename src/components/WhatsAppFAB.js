export default function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/212600000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      aria-label="Contact us on WhatsApp"
    >
      <span className="relative top-[-1px]">💬</span>
    </a>
  );
}
