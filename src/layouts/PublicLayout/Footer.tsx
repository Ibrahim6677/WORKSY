import { Link } from "react-router-dom";
import logo from "../../assets/images/Vector1.svg";

const Footer = () => {
  return (
    <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link to="/home" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8">
              <img
                src={logo}
                alt="Worksy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-black">WORKSY</span>
          </Link>
          <p className="text-sm text-gray-600 mb-4 max-w-[200px]">
            Trusted by thousands of teams worldwide. Join them.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-[#6629DE] transition-colors duration-200">
              <i className="ri-facebook-fill text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#6629DE] transition-colors duration-200">
              <i className="ri-twitter-fill text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#6629DE] transition-colors duration-200">
              <i className="ri-instagram-line text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#6629DE] transition-colors duration-200">
              <i className="ri-linkedin-fill text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-[#6629DE] transition-colors duration-200">
              <i className="ri-youtube-fill text-xl"></i>
            </a>
          </div>
        </div>

        {/* Product Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold text-lg text-black mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Features</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Pricing</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Case studies</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Reviews</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Updates</Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold text-lg text-black mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">About</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Contact us</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Careers</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Culture</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Blog</Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold text-lg text-black mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Getting started</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Help center</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Server status</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Report a bug</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-[#6629DE] transition-colors duration-200">Chat support</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>
          Copyright © 2025 worksy | All Rights Reserved |{" "}
          <Link to="#" className="text-[#6629DE] hover:underline">Terms and Conditions</Link> |{" "}
          <Link to="#" className="text-[#6629DE] hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;