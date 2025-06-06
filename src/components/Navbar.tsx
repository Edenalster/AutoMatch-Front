import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Trophy, Menu, X, UserRound, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import NotificationBell from "./NotificationBell";

/**
 * Props for navigation link components.
 */
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Desktop navigation link component.
 */
const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-white/80 hover:text-chess-gold transition-colors duration-200 font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-chess-gold after:transition-all after:duration-300 hover:after:w-full "
    >
      {children}
    </a>
  );
};

/**
 * Mobile navigation link component.
 */
const MobileNavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors duration-200 font-medium"
    >
      {children}
    </a>
  );
};

/**
 * ProfileDropdown component renders a dropdown menu for authenticated users,
 * including a logout option.
 *
 * @param {object} props
 * @param {() => void} props.onLogout - Function to call when the user clicks the logout button.
 * @returns {JSX.Element} The Profile dropdown menu.
 */
interface ProfileDropdownProps {
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout }) => {
  const [userDisplay, setUserDisplay] = useState("Player");
  const [userTag, setUserTag] = useState("");

  useEffect(() => {
    // Check for any stored email in localStorage
    const storedEmail = localStorage.getItem("email");
    const lichessId = localStorage.getItem("lichessId");

    console.log("Email in localStorage:", storedEmail);
    console.log("LichessId in localStorage:", lichessId);

    // If we have a Lichess ID, use it
    if (lichessId && lichessId.length > 0) {
      setUserDisplay(lichessId);
      setUserTag(`@${lichessId}`);
      return;
    }

    // If we have an email directly in localStorage
    if (storedEmail) {
      const emailPrefix = storedEmail.split("@")[0];
      setUserDisplay(emailPrefix);
      setUserTag(storedEmail);
      return;
    }

    // Try to get user data (which might contain email)
    const userJson = localStorage.getItem("user");
    console.log("User data in localStorage:", userJson);

    if (!userJson) return;

    try {
      // Try parsing as JSON (for Google login or user object)
      const userData = JSON.parse(userJson);
      console.log("Parsed user data:", userData);

      // Check if the user data has an email property
      if (userData.email) {
        const emailPrefix = userData.email.split("@")[0];
        setUserDisplay(emailPrefix);
        setUserTag(userData.email);
        return;
      }

      // If the data is an email string itself (from Google login)
      if (typeof userData === "string" && userData.includes("@")) {
        const emailPrefix = userData.split("@")[0];
        setUserDisplay(emailPrefix);
        setUserTag(userData);
        return;
      }
    } catch (error) {
      console.log("Parsing user data failed, treating as string:", error);

      // If parsing fails, check if the raw string is an email
      if (userJson.includes("@")) {
        const emailPrefix = userJson.split("@")[0];
        setUserDisplay(emailPrefix);
        setUserTag(userJson);
        return;
      }

      // For normal email login, the user value is just the MongoDB ID
      // In this case, we need to use the email from the login form
      // Since we don't have access to it directly, use a fallback username
      const formEmail = localStorage.getItem("formEmail");
      if (formEmail) {
        const emailPrefix = formEmail.split("@")[0];
        setUserDisplay(emailPrefix);
        setUserTag(formEmail);
        return;
      }

      // If we have no other identifiers, use the first part of the user ID
      // This is better than showing "Player"
      if (userJson && userJson.length > 0) {
        // If it looks like a MongoDB ObjectId, use part of it
        if (userJson.match(/^[0-9a-f]{24}$/i)) {
          const shortId = userJson.substring(0, 8) + "...";
          setUserDisplay(shortId);
          return;
        }

        // Otherwise just use whatever string we have
        setUserDisplay(userJson);
      }
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-yellow-700"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-chess-gold/20 text-chess-gold">
              <UserRound className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal focus:bg-yellow-700">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userDisplay}</p>
            {userTag && (
              <p className="text-xs leading-none text-muted-foreground">
                {userTag}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link to="/profile" className="flex items-center w-full">
            <UserRound className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Navbar component that renders the navigation bar.
 */
interface NavbarProps {
  showItems: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showItems }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Local state to manage login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tournamentLink, setTournamentLink] = useState<string | null>(null);

  useEffect(() => {
    const storedLink = localStorage.getItem("pendingTournamentLink");
    if (storedLink) {
      setTournamentLink(storedLink);
    }
  }, []);

  // On component mount, check for an auth token in localStorage.
  useEffect(() => {
    // Check for token - look for either "token" or "accessToken" based on your auth implementation
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // Add an event listener to track auth state changes
    const handleStorageChange = () => {
      const currentToken =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      setIsLoggedIn(!!currentToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Listen for scroll events to update the navbar background.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   * handleLogout clears the auth token and updates the login state.
   */
  const handleLogout = () => {
    // Remove all auth-related items from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("lichessId");
    localStorage.removeItem("email");

    // Update state to reflect logged out status
    setIsLoggedIn(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
        isScrolled
          ? "bg-chess-dark/80 backdrop-blur-md shadow-md border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          className="flex items-center space-x-2"
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Trophy className="h-8 w-8 text-chess-gold animate-pulse-soft" />
          <span className="text-xl font-bold tracking-tight text-white">
            <span className="text-chess-gold">Auto</span>
            <span>Match</span>
          </span>
        </a>

        {/* Desktop Menu (hidden on mobile devices) */}
        <div className="hidden md:flex items-center space-x-6">
          {showItems ? (
            <>
              <NavLink href="#tournaments">Tournaments</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
            </>
          ) : (
            <></>
          )}

          {/* Action buttons for desktop */}

          <div className="flex items-center space-x-3 ml-4">
            <NotificationBell tournamentLink={tournamentLink} />
            <Link to="/find-match">
              <Button className="primary-btn" size="sm">
                Play Now
              </Button>
            </Link>
            {isLoggedIn ? (
              // Show the profile dropdown ONLY when logged in
              <ProfileDropdown onLogout={handleLogout} />
            ) : (
              // Show login/register buttons when NOT logged in
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    size="sm"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    size="sm"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button (visible only on mobile devices) */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="text-white"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-chess-dark/95 backdrop-blur-md shadow-lg animate-slide-down border-b border-white/10 p-4">
          <div className="flex flex-col space-y-4 py-2">
            <MobileNavLink
              href="#tournaments"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tournaments
            </MobileNavLink>
            <MobileNavLink
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </MobileNavLink>
            <MobileNavLink
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </MobileNavLink>
            <MobileNavLink
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </MobileNavLink>

            {/* Action buttons for mobile */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Button className="primary-btn w-full" size="sm">
                Play Now
              </Button>
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full"
                  size="sm"
                >
                  Log Out
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3 col-span-1">
                  <Link to="/login" className="col-span-1">
                    <Button
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full"
                      size="sm"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" className="col-span-1">
                    <Button
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full"
                      size="sm"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
