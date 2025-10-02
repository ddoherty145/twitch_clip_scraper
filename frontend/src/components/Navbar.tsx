import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, Gamepad2, Users, Info, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/highlights', label: 'Highlights', icon: Users },
    { path: '/about', label: 'About', icon: Info },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary shadow-sm border-b border-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <div className="bg-secondary p-2 rounded-lg">
              <Zap className="h-6 w-6 text-quaternary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-quaternary">
                The Clipper
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-secondary text-quaternary'
                      : 'text-quaternary hover:text-white hover:bg-tertiary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-quaternary">
            <div className="w-2 h-2 bg-tertiary rounded-full"></div>
            <span>Live</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-quaternary hover:text-white hover:bg-tertiary transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-secondary text-quaternary'
                        : 'text-quaternary hover:text-white hover:bg-tertiary'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Mobile Status */}
            <div className="mt-4 px-4 py-2 flex items-center space-x-2 text-sm text-quaternary">
              <div className="w-2 h-2 bg-tertiary rounded-full"></div>
              <span>Live</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
