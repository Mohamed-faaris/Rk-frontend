import { useMemo } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PillNav, { type PillNavItem } from '@/components/PillNav';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  if (location.pathname !== '/') {
    return null;
  }

  const items = useMemo<PillNavItem[]>(
    () => [
      { label: 'Home', href: '/#home' },
      { label: 'About', href: '/#about' },
      { label: 'Updates', href: '/#updates-news' },
      { label: 'Services', href: '/services' },
      { label: 'Projects', href: '/#portfolio' },
      { label: 'Our Team', href: '/#testimonials' },
      { label: 'Contact', href: '/#contact' },
    ],
    [],
  );

  const activeHref = useMemo(() => {
    const match = items.find((item) => item.href === location.pathname);
    if (match) {
      return match.href;
    }

    return undefined;
  }, [items, location.pathname]);

  const rightSlot = (
    <>
      <Link to="/orders" className="pill-action-icon" aria-label="Notifications">
        <Bell size={18} />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="pill-action-icon" aria-label="Account menu">
            <User size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={12} className="w-52 z-[100]">
          <DropdownMenuLabel>{isAuthenticated ? user?.name || 'My Account' : 'Guest'}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {isAuthenticated ? (
            <>
              <DropdownMenuItem onSelect={() => navigate('/account')}>Account</DropdownMenuItem>
              {(user?.role === 'admin' || user?.role === 'ceo') && (
                <DropdownMenuItem onSelect={() => navigate('/management')}>
                  Management Dashboard
                </DropdownMenuItem>
              )}
              {(user?.role === 'admin' || user?.role === 'ceo' || user?.role === 'finance_analyst') && (
                <DropdownMenuItem onSelect={() => navigate('/finance-analytics')}>
                  Finance Analytics Update
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  logout();
                  navigate('/');
                }}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onSelect={() => navigate('/login')}>Login</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/register')}>Register</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <PillNav
      logo="/rklogofinal.webp"
      logoAlt="RajKayal Logo"
      brandName="RajKayal Creative Hub"
      items={items}
      activeHref={activeHref}
      className="site-pill-nav rk-black-gold-nav"
      ease="power2.easeOut"
      baseColor="#FDB913"
      pillColor="#0A0A0F"
      hoveredPillTextColor="#0A0A0F"
      pillTextColor="#FDB913"
      theme="dark"
      rightSlot={rightSlot}
      initialLoadAnimation={false}
    />
  );
};

export default Navbar;
