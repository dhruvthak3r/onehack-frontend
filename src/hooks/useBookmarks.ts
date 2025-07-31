import { useState, useEffect } from "react";
import { Hackathon, ApiResponse} from "@/types/hackathon";

const API_BASE = "https://99b635cdad97.ngrok-free.app";
const DEFAULT_HEADERS = {
  "ngrok-skip-browser-warning": "69420",
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = "hackhub-bookmarks";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, []);

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
      const response = await fetch(`${API_BASE}/api/bookmark/${hackathon.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify(hackathon),
        credentials: "include",
      });

      if (response.redirected) {
      // Do the actual browser redirect manually
      window.location.href = response.url;
      return;
       }

      if (!response.ok) {
        throw new Error("Failed to add bookmark");
      }

      const data: ApiResponse = await response.json();
      if (!data.success) {
        throw new Error("API returned unsuccessful response");
      }

      if (!isBookmarked(hackathon)) {
        const newBookmarks = [...bookmarks, hackathon];
        saveBookmarks(newBookmarks);
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (hackathon: Hackathon) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/bookmark`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify(hackathon),
      });

      if (!response.ok) {
        throw new Error("Failed to remove bookmark");
      }

      const data: ApiResponse = await response.json();
      if (!data.success) {
        throw new Error("API returned unsuccessful response");
      }

      const newBookmarks = bookmarks.filter(
        (b) => !(b.title === hackathon.title && b.start_date === hackathon.start_date)
      );
      saveBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
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
