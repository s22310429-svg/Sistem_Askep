import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <span className="app-footer-copy">
          Sistem Asuhan Keperawatan &copy; {year}
        </span>
        <span className="app-footer-sep">|</span>
        <span className="app-footer-text">Healthcare Platform</span>
      </div>
    </footer>
  );
};

export default Footer;
