import { useState, useEffect } from "react";
import { Hackathon } from "@/types/hackathon";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = "hackhub-bookmarks";

  // Load bookmarks from localStorage
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

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks: Hackathon[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };

  const isBookmarked = (hackathon: Hackathon) => {
    return bookmarks.some(b => 
      b.title === hackathon.title && 
      b.startDate === hackathon.startDate
    );
  };

  const addBookmark = async (hackathon: Hackathon) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      // await fetch('/api/bookmark', { method: 'POST', body: JSON.stringify(hackathon) });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
      // In a real app, this would make an API call
      // await fetch('/api/bookmark', { method: 'DELETE', body: JSON.stringify(hackathon) });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newBookmarks = bookmarks.filter(b => 
        !(b.title === hackathon.title && b.startDate === hackathon.startDate)
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
    toggleBookmark
  };
}