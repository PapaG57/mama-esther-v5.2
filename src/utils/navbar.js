import { useEffect } from "react";

export default function useScrollNavbar(navbarRef) {
  useEffect(() => {
    const el = navbarRef.current;
    if (!el) return;

    const onScroll = () => {
      if (window.scrollY > 100) {
        el.classList.add("scrolled");
      } else {
        el.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // État initial

    return () => window.removeEventListener("scroll", onScroll);
  }, [navbarRef]);
}
