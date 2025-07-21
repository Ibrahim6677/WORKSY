import { useState, useEffect } from "react";
import logo from "../../assets/images/Vector1.svg";
import { Link, NavLink } from "react-router-dom";
import {BottomLink, BottomMenuLink} from "../../components/atoms/Bottom/BottomLink";
import { useAuth } from "../../hooks/useAuth/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY >= 500;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  return (
    <nav
      className={`w-full transition-all duration-300 px-4 sm:px-4 md:px-6 ${
        scrolled
          ? "fixed top-0 left-0 right-0 z-50 bg-[#6629DE] shadow-md rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl lg:rounded-full lg:top-3 lg:max-w-[1380px] lg:mx-auto transition-all duration-300"
          : "relative bg-white"
      }`}
    >
      <div className="h-[60px] sm:h-[70px] md:h-[80px] flex items-center justify-between capitalize max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10">
              <img
                src={logo}
                alt="Worksy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className={`text-lg sm:text-xl font-bold ${
                scrolled ? "text-white" : "text-black"
              }`}
            >
              WORKSY
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center justify-center space-x-4 xl:space-x-6 ml-4 xl:ml-7">
          {["home", "features", "resources", "contact us"].map((item) => (
            <li
              key={item}
              className={`text-sm xl:text-md font-bold cursor-pointer hover:scale-105 transition-transform ${
                scrolled
                  ? "text-white hover:underline"
                  : "text-black hover:text-[#6629DE]"
              }`}
            >
              <NavLink
                to={`/${item}`}
                className={({ isActive }) =>
                  isActive ? "border-b-2 border-current pb-1" : ""
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
          {!isAuthenticated ? (
            <>
              <BottomLink to="/login" variant="outline" scrolled={scrolled}>
                Sign in
              </BottomLink>
              <BottomLink to="/workspace" variant="filled" scrolled={scrolled}>
                Get Started
              </BottomLink>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={user?.avatar || '/path/to/default-avatar.png'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              {/* ممكن تضيف اسم المستخدم أو قائمة منسدلة هنا */}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex lg:hidden z-50 p-1.5 sm:p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <i
              className={`ri-close-line text-xl sm:text-2xl ${scrolled && !menuOpen ? "text-white" : "text-black"}`}
            ></i>
          ) : (
            <i
              className={`ri-menu-line text-xl sm:text-2xl ${scrolled ? "text-white" : "text-black"}`}
            ></i>
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-40 transform transition-all duration-300 lg:hidden
            ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
          <div className="flex flex-col h-full pt-24 px-6">
            {/* Logo in Menu */}
            <div className="absolute top-7 left-6 flex items-center gap-2">
              <div className="w-8 h-8">
                <img
                  src={logo}
                  alt="Worksy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-black">WORKSY</span>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-6">
              {["home", "features", "resources", "contact us"].map((item) => (
                <li
                  key={item}
                  className="transform transition-transform duration-300 hover:translate-x-2"
                >
                  <NavLink
                    to={`/${item}`}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-lg font-semibold capitalize transition-colors duration-200 
                      ${
                        isActive
                          ? "text-[#6629DE]"
                          : "text-gray-800 hover:text-[#6629DE]"
                      }`
                    }
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="mt-auto mb-8 space-y-4">
              {!isAuthenticated ? (
                <>
                  <BottomMenuLink to="/login" variant="outline">
                    Sign in
                  </BottomMenuLink>
                  <BottomMenuLink to="/workspace" variant="filled">
                    Get Started
                  </BottomMenuLink>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    src={user?.avatar || '/path/to/default-avatar.png'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  {/* ممكن تضيف اسم المستخدم أو قائمة منسدلة هنا */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
