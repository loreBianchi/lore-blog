interface MobileMenuBtnProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuBtn({ isOpen, onClick }: MobileMenuBtnProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 hover:bg-green-400/10 transition-colors border border-green-400/30"
      aria-label="Toggle menu"
    >
      <div className="w-5 h-4 relative">
        <span
          className={`absolute top-0 left-0 w-full h-px bg-green-400 transition-all duration-300 ${
            isOpen ? "rotate-45 top-1.5" : ""
          }`}
        />
        <span
          className={`absolute top-1.5 left-0 w-full h-px bg-green-400 transition-all duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute top-3 left-0 w-full h-px bg-green-400 transition-all duration-300 ${
            isOpen ? "-rotate-45 top-1.5" : ""
          }`}
        />
      </div>
    </button>
  );
}
