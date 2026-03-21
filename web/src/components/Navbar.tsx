import { useMemo } from 'react';
import { Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PillNav, { type PillNavItem } from '@/components/PillNav';

const Navbar = () => {
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  const items = useMemo<PillNavItem[]>(
    () => [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/#about' },
      { label: 'Services', href: '/services' },
      { label: 'Projects', href: '/#portfolio' },
      { label: 'Our Team', href: '/#testimonials' },
      { label: 'Contact', href: '/contact' },
    ],
    [],
  );

  const activeHref = useMemo(() => {
    const match = items.find((item) => item.href === location.pathname);
    if (match) {
      return match.href;
    }

    if (location.pathname === '/') {
      return '/';
    }

    return undefined;
  }, [items, location.pathname]);

  const rightSlot = (
    <>
      <Link to="/orders" className="pill-action-icon" aria-label="Notifications">
        <Bell size={18} />
      </Link>
      <Link to="/account" className="pill-action-icon" aria-label="Account">
        <User size={18} />
      </Link>
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
