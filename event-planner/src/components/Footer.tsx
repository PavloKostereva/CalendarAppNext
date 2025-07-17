'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-700 mt-10 border-t">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Планувальник подій. Усі права захищені.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="/about" className="text-sm hover:text-blue-500">Про нас</a>
          <a href="/contact" className="text-sm hover:text-blue-500">Контакти</a>
          <a href="/privacy" className="text-sm hover:text-blue-500">Політика</a>
        </div>
      </div>
    </footer>
  );
}
