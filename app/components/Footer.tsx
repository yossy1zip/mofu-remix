import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="bg-black text-center text-white py-5 mt-20 h-20">
      <p>
        ©2014-2025{" "}
        <span className="text-pink-400">MOFUCRAFT!!!</span>
      </p>
      <p>
        <Link to="//mofucraft.net/terms" className="text-blue-400 underline text-decoration-none">
          利用規約
        </Link>
      </p>
    </footer>
  );
}