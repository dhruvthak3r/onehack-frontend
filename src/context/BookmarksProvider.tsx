import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Hackathon, ApiResponse } from "@/types/hackathon";

const API_BASE = "https://onehack.live";
const STORAGE_KEY = "bookmarkedHackathons";

interface BookmarksContextType {
  bookmarks: Hackathon[];
  refreshBookmarks: () => void;
  loading: boolean;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarksContext must be used within BookmarksProvider");
  }
  return context;
};

export const BookmarksProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [bookmarks, setBookmarks] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshBookmarks = async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user?.sub) {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE}/api/get-bookmarks/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch bookmarks");

        const data: ApiResponse = await res.json();
        setBookmarks(data.hackathons);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.hackathons));
      } else {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setBookmarks(JSON.parse(cached));
        }
      }
    } catch (err) {
      console.error("Bookmark fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.sub) return;

    refreshBookmarks();
    const interval = setInterval(refreshBookmarks, 9 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  return (
    <BookmarksContext.Provider value={{ bookmarks, refreshBookmarks, loading }}>
      {children}
    </BookmarksContext.Provider>
  );
};
