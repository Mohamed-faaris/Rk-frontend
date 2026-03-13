import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, LogOut, User, Settings, Briefcase, ShoppingCart, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/context/AuthContext";
import { applicationService } from "@/lib/applicationService";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"accepted" | "rejected" | null>(null);
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle hash navigation on page load
  useEffect(() => {
    const hash = window.location.hash;
    // Only scroll to hash if we're on the home page (path is /)
    if (hash && window.location.pathname === '/') {
      // Wait for page to load, then scroll to element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Keep latest application status for navbar notification dropdown.
  useEffect(() => {
    let isMounted = true;
    const statusQuery = new URLSearchParams(location.search).get("status");

    if (statusQuery === "accepted" || statusQuery === "rejected") {
      localStorage.setItem("latestApplicationStatus", statusQuery);
      if (isMounted) {
        setApplicationStatus(statusQuery);
      }
    }

    const storedStatus = localStorage.getItem("latestApplicationStatus");
    if (storedStatus === "accepted" || storedStatus === "rejected") {
      if (isMounted) {
        setApplicationStatus(storedStatus);
      }
    } else {
      if (isMounted) {
        setApplicationStatus(null);
      }
    }

    const syncFromServer = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const result = await applicationService.getMyApplicationStatus();
        const serverStatus = result?.application?.status;

        if (serverStatus === "accepted" || serverStatus === "rejected") {
          localStorage.setItem("latestApplicationStatus", serverStatus);
          if (isMounted) {
            setApplicationStatus(serverStatus);
          }
          return;
        }

        if (isMounted) {
          setApplicationStatus(null);
        }
      } catch {
        // Keep the local cached status if server call fails.
      }
    };

    syncFromServer();

    return () => {
      isMounted = false;
    };
  }, [location.search, isAuthenticated]);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // If we're on the home page, just scroll to the section
    if (window.location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home with the hash
      navigate('/' + href);
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClearNotification = () => {
    localStorage.removeItem("latestApplicationStatus");
    setApplicationStatus(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#home" onClick={handleLogoClick} className="flex items-center space-x-2 md:space-x-3 group cursor-pointer min-w-0">
            <img src="/rklogofinal.png" alt="RajKayal Logo" className="h-9 w-9 md:h-12 md:w-12 flex-shrink-0 drop-shadow-[0_0_8px_rgba(253,185,19,0.3)] transition-all duration-300" />
            <span className="brand-display max-w-[9.5rem] text-[11px] leading-tight bg-gradient-to-r from-[#FDB913] to-[#D4A520] bg-clip-text text-transparent sm:max-w-[11rem] sm:text-xs md:max-w-[12rem] md:text-sm lg:max-w-none lg:text-base xl:text-lg xl:whitespace-nowrap">
              RajKayal Creative Hub
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Auth & Theme Controls */}
          <div className="flex items-center space-x-1.5 md:space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                  aria-label="Application notifications"
                >
                  <Bell className="h-5 w-5" />
                  {applicationStatus && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Application Updates
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {applicationStatus === "accepted" && (
                  <div className="px-3 py-2 text-sm text-foreground">
                    <p className="font-semibold text-emerald-500">Accepted</p>
                    <p className="mt-1 text-muted-foreground">
                      Congratulations! Your hard work is opening new doors. Keep your confidence high and step into this next chapter with pride.
                    </p>
                  </div>
                )}
                {applicationStatus === "rejected" && (
                  <div className="px-3 py-2 text-sm text-foreground">
                    <p className="font-semibold text-amber-500">Rejected</p>
                    <p className="mt-1 text-muted-foreground">
                      This is one step, not your final destination. Keep improving your skills and come back stronger. Your time will come.
                    </p>
                  </div>
                )}
                {!applicationStatus && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No new application updates right now.
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClearNotification} disabled={!applicationStatus}>
                  Clear notification
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden items-center space-x-2 lg:flex">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/management')} className="md:hidden">
                        <Settings className="mr-2 h-4 w-4" />
                        Management Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} className="hidden lg:inline-flex">
                Login
              </Button>
            )}

            {/* Management Dashboard Link for Desktop */}
            {isAuthenticated && user?.role === 'admin' && (
              <Button variant="outline" onClick={() => navigate('/management')} className="hidden xl:inline-flex bg-transparent border-border text-foreground hover:bg-accent/10 hover:text-accent hover:border-accent">
                Management
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden fixed left-0 right-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background/95 py-4 backdrop-blur-xl animate-fade-in md:top-20 md:max-h-[calc(100vh-5rem)]">
            <div className="flex flex-col space-y-1 px-4 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-lg px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-2 border-t border-border pt-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Logged in as {user?.name}
                    </div>
                    <button
                      onClick={() => {
                        navigate('/account');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                    >
                      <User className="inline mr-2 h-4 w-4" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/orders');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                    >
                      <ShoppingCart className="inline mr-2 h-4 w-4" />
                      My Orders
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('/management');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                      >
                        Management Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
