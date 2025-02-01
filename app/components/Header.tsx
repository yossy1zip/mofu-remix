import { Link } from '@remix-run/react';

export default function Header() {
  return (
    <header className="w-full text-center h-10">
      <Link to="/" className="text-decoration-none block">
        <div className="bg-[#424242] text-white text-3xl leading-10 font-raleway">
          MOFUCRAFT!!!
        </div>
      </Link>
      <Link to="/" className="fixed left-4 top-5 z-50">
        <div className="w-auto h-16">
          <img
            src="//mofucraft.net/image/mofucraft.webp"
            alt="Mofucraft Logo"
            className="h-full rounded-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      </Link>
    </header>
  );
}