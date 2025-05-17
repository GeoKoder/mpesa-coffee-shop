
import React from "react";
import { Coffee } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-primary py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Coffee Kiosk</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="text-white hover:text-primary-light font-medium">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-primary-light font-medium">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-primary-light font-medium">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
