import { useState } from "react";
import { Link, Outlet } from "react-router";
import { Search } from "lucide-react";
import { Avatar, AvatarImage } from "@/components";
import { Person } from "@/assets/images";

const NAV_LINKS = [
  { label: "Movies", to: "/" },
  { label: "Cinemas", to: "/#" },
];

const MOCK_USER = {
  id: "user-1",
  name: "Derry",
};

const UserLayout = () => {
  const [isLoggedIn] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full border-b bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className="text-2xl font-semibold tracking-tight text-card-foreground"
            >
              Movio
            </Link>
            <div className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="transition hover:text-card-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-1 justify-center px-1">
            <div className="flex w-full max-w-lg items-center gap-3 rounded-md border border-input bg-input/70 px-8 py-3 text-sm text-muted-foreground shadow-sm shadow-card/10">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                aria-label="Search movies"
                placeholder="Search Movies..."
                className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/my-tickets"
                  className="rounded-md bg-primary px-10 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/80"
                >
                  My Tickets
                </Link>
                <div className="flex items-center gap-3 px-3 py-2">
                  <p className="font-medium text-card-foreground">
                    Hi, {MOCK_USER.name}
                  </p>
                  <Avatar>
                    <AvatarImage src={Person} alt={MOCK_USER.name} />
                  </Avatar>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md border border-primary! px-12 py-3 text-sm font-semibold text-card-foreground transition hover:border-card"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary px-12 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
