import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PillNav, { type PillNavItem } from '@/components/PillNav';

const Navbar = () => {
  const location = useLocation();

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

  return (
    <PillNav
      logo="/rklogofinal.png"
      logoAlt="RajKayal Logo"
      items={items}
      activeHref={activeHref}
      className="site-pill-nav"
      ease="power2.easeOut"
      baseColor="#101418"
      pillColor="#f5f7fb"
      hoveredPillTextColor="#f5f7fb"
      pillTextColor="#101418"
      theme="light"
      initialLoadAnimation={false}
    />
  );
};

export default Navbar;
