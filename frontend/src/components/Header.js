import React from 'react';

const Header = ({ title, subtitle, user, actions }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h1 className="app-header-title">{title}</h1>
        {subtitle && <p className="app-header-subtitle">{subtitle}</p>}
        <span className="app-header-date">{dateStr}</span>
      </div>
      <div className="app-header-right">
        {actions && <div className="app-header-actions">{actions}</div>}
        {user && (
          <div className="app-header-user">
            <div className="app-header-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="app-header-user-info">
              <span className="app-header-user-name">{user.username}</span>
              <span className="app-header-user-role">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
