import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faWandMagicSparkles, faUser, faBars, faTimes, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';  // Added faArrowRightFromBracket
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <div className="relative text-lg">
      <span
        className={`cursor-pointer ${
          isActive ? 'after:w-full' : 'hover:after:w-full'
        } hover:after:animate-underline-expand after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-out after:transform after:-translate-x-1/2`}
      >
        <Link to={to} onClick={onClick}>{label}</Link>
      </span>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <section className="font-suse text-md">
      <div className="flex flex-row justify-between items-center p-4 md:p-6">
        <div className="font-chakra text-3xl bg-black text-white p-1 rounded-lg">
          Echsrop
        </div>
       
        {/* Nav items visible on larger screens */}
        <div className="hidden md:flex flex-row gap-4">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/Transactions" label="Transactions" />
        </div>
        <div className="hidden md:flex flex-row gap-4 items-center text-lg">
          <div>Saved</div>
          <div>Lists</div>
          <button className="relative overflow-hidden flex flex-row justify-center items-center gap-1 text-white bg-slate-700 p-1 rounded-lg group">
            <span className="relative z-10 flex items-center">
              <div>Generate</div>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="ml-2" />
            </span>
            <span className="absolute inset-0 bg-black origin-center transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center ">
          <FontAwesomeIcon icon={faBell} className="hidden md:block text-black-500 hover:cursor-pointer" />
          <div className='hidden md:block'>|</div>
          <div className="relative">
            <div
              onClick={toggleUserDropdown}
              className="flex flex-row justify-center items-center gap-1 hover:cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <div className="bg-gray-200 p-2 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-gray-700" />
                </div>
              </div>
              <div className="text-lg">User</div>
            </div>
            {/* Dropdown menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/signup" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  Logout
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Link>
              </div>
            )}
          </div>
          <div className='md:hidden'>|</div>

           {/* Hamburger menu for smaller screens */}
        <div className="md:hidden pt-1 ">
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-black-500 text-xl" />
          </button>
        </div>
        </div>
      </div>

      {/* Mobile menu for smaller screens */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start p-4">
          <NavItem to="/" label="Dashboard" onClick={toggleMenu} />
          <NavItem to="/Transactions" label="Transactions" onClick={toggleMenu} />
          <div className="flex flex-col gap-2 mt-4">
            <div>Saved</div>
            <div>Lists</div>
            <button className="relative overflow-hidden flex flex-row justify-center items-center gap-1 text-white bg-slate-700 p-2 rounded-lg group">
              <span className="relative z-10 flex items-center">
                <div>Generate</div>
                <FontAwesomeIcon icon={faWandMagicSparkles} className="ml-2" />
              </span>
              <span className="absolute inset-0 bg-black origin-center transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Navbar;
