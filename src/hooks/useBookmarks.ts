import { useState, useEffect } from "react";
import { Hackathon } from "@/types/hackathon";
import { useAuth0 } from "@auth0/auth0-react";
import { log } from "console";

interface BookmarkResponse {
  message: string;
}

interface HackathonListResponse {
  bookmarks: Hackathon[];
}

const API_BASE = "https://c42fa33beed8.ngrok-free.app";
const DEFAULT_HEADERS = {
  "ngrok-skip-browser-warning": "69420",
};

export function useBookmarks() {
  const { isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup,logout } = useAuth0();
  const [bookmarks, setBookmarks] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = "hackhub-bookmarks";

  // ✅ Correct getValidToken
  const getValidToken = async (): Promise<string> => {
    const authParams = {
      authorizationParams: {
        audience: "https://onehack.dev/api",
        scope: "openid profile email offline_access",
      },
    };

    try {
      const token =  await getAccessTokenSilently(authParams);
      console.log("🔐 Access Token:", token);
      return token;
    } catch (err) {
      console.warn("Silent token failed, using popup login...", err);
      return await getAccessTokenWithPopup(authParams);
    }
  };

  const fetchWithAuth = async <T>(
    endpoint: string,
    method: string,
    body?: any
  ): Promise<T> => {
    const token = await getValidToken();

   
    console.log("📥 [Before Request] Token being used:", token);

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...DEFAULT_HEADERS,
      },
    });

    console.log("📥 [After Request] Token being used:", token);

    if (!response.ok) {
      throw new Error(`Failed to ${method} ${endpoint}`);
    }

    return response.json() as Promise<T>;
  };

  useEffect(() => {
    //logout({ logoutParams: { returnTo: window.location.origin } });
    const initBookmarks = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const data = await fetchWithAuth<HackathonListResponse>(`/api/bookmark`, "GET");
          setBookmarks(data.bookmarks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.bookmarks));
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            setBookmarks(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error("Error initializing bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    initBookmarks();
  }, [isAuthenticated]);

  const saveBookmarks = (newBookmarks: Hackathon[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };

  const isBookmarked = (hackathon: Hackathon) => {
    return bookmarks.some(
      (b) => b.title === hackathon.title && b.start_date === hackathon.start_date
    );
  };

  const addBookmark = async (hackathon: Hackathon) => {
    setLoading(true);
    try {
      await fetchWithAuth<BookmarkResponse>(`/api/bookmark/${hackathon.id}`, "POST");

      if (!isBookmarked(hackathon)) {
        const newBookmarks = [...bookmarks, hackathon];
        saveBookmarks(newBookmarks);
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (hackathon: Hackathon) => {
    setLoading(true);
    try {
      await fetchWithAuth<BookmarkResponse>(`/api/bookmark/${hackathon.id}`, "DELETE", hackathon);

      const newBookmarks = bookmarks.filter(
        (b) => !(b.title === hackathon.title && b.start_date === hackathon.start_date)
      );
      saveBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (hackathon: Hackathon) => {
    if (isBookmarked(hackathon)) {
      await removeBookmark(hackathon);
    } else {
      await addBookmark(hackathon);
    }
  };

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
  };
}
