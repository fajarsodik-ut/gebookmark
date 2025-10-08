import { supabase } from './supabase';

export type Bookmark = {
  id: string;
  name: string;
  url: string;
  isPinned: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

// Get or create a user ID for anonymous users (stored in localStorage)
export function getUserId(): string {
  let userId = localStorage.getItem('markit_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('markit_user_id', userId);
  }
  return userId;
}

// Fetch all bookmarks for the current user
export async function fetchBookmarks(): Promise<Bookmark[]> {
  try {
    const userId = getUserId();
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }

    return (data || []).map(bookmark => ({
      id: bookmark.id,
      name: bookmark.name,
      url: bookmark.url,
      isPinned: bookmark.is_pinned,
      userId: bookmark.user_id,
      createdAt: bookmark.created_at,
      updatedAt: bookmark.updated_at,
    }));
  } catch (error) {
    console.error('Failed to fetch bookmarks:', error);
    return [];
  }
}

// Add a new bookmark
export async function addBookmark(name: string, url: string): Promise<Bookmark | null> {
  try {
    const userId = getUserId();
    
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        name,
        url,
        is_pinned: false,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      url: data.url,
      isPinned: data.is_pinned,
      userId: data.user_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Failed to add bookmark:', error);
    return null;
  }
}

// Update a bookmark
export async function updateBookmark(
  id: string,
  updates: { name?: string; url?: string; isPinned?: boolean }
): Promise<boolean> {
  try {
    const userId = getUserId();
    
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;

    const { error } = await supabase
      .from('bookmarks')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating bookmark:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to update bookmark:', error);
    return false;
  }
}

// Delete a bookmark
export async function deleteBookmark(id: string): Promise<boolean> {
  try {
    const userId = getUserId();
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    return false;
  }
}

// Toggle pin status
export async function togglePin(id: string, currentPinStatus: boolean): Promise<boolean> {
  return updateBookmark(id, { isPinned: !currentPinStatus });
}

// Migrate localStorage bookmarks to Supabase
export async function migrateLocalBookmarks(): Promise<void> {
  try {
    const localBookmarks = localStorage.getItem('bookmarks');
    if (!localBookmarks) return;

    const bookmarks = JSON.parse(localBookmarks);
    const userId = getUserId();

    for (const bookmark of bookmarks) {
      await supabase.from('bookmarks').insert({
        name: bookmark.name,
        url: bookmark.url,
        is_pinned: bookmark.isPinned || false,
        user_id: userId,
      });
    }

    // Clear localStorage after migration
    localStorage.removeItem('bookmarks');
    console.log('Successfully migrated bookmarks to Supabase');
  } catch (error) {
    console.error('Failed to migrate bookmarks:', error);
  }
}
