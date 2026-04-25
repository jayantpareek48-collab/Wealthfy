const links = [
  { id: "home", label: "Home" },
  { id: "courses", label: "Courses" },
  { id: "calculators", label: "Calculators" },
  { id: "game", label: "Game" }
];

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-night/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#home" className="text-xl font-semibold text-white">
          Wealth<span className="text-accent">ify</span>
        </a>
        <ul className="flex gap-4 text-sm text-slate-300 sm:gap-6">
          {links.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className="transition hover:text-accent">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
