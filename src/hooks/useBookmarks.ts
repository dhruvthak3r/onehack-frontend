import { useAuth0 } from "@auth0/auth0-react";
import { Hackathon, BookmarkResponse } from "@/types/hackathon";
import { useBookmarksContext } from "@/context/BookmarksProvider";

const API_BASE = "https://api.onehack.live";



export function useBookmarks() {
  const { isAuthenticated, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  const { bookmarks, refreshBookmarks, loading } = useBookmarksContext();

  const getValidToken = async (): Promise<string> => {
    const authParams = {
      authorizationParams: {
        audience: "https://onehack.dev/api",
        scope: "openid profile email offline_access",
      },
    };

    try {
      return await getAccessTokenSilently(authParams);
    } catch {
      return await getAccessTokenWithPopup(authParams);
    }
  };

  const fetchWithAuth = async <T>(endpoint: string, method: string): Promise<T> => {
    const token = await getValidToken();
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${method} ${endpoint}`);
    }

    return response.json() as Promise<T>;
  };

  const isBookmarked = (hackathon: Hackathon) =>
    bookmarks.some((b) => b.id === hackathon.id);

  const addBookmark = async (hackathon: Hackathon) => {
    await fetchWithAuth<BookmarkResponse>(`/api/bookmark/${hackathon.id}`, "POST");
    refreshBookmarks(); // update state from context
  };

  const removeBookmark = async (hackathon: Hackathon) => {
    await fetchWithAuth<BookmarkResponse>(`/api/bookmark/${hackathon.id}`, "DELETE");
    refreshBookmarks(); // update state from context
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
    refreshBookmarks,
  };
}
