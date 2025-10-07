import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Link, X, Pin, Star, Pencil, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
type Bookmark = {
  id: string;
  name: string;
  url: string;
  isPinned?: boolean;
};
const bookmarkSchema = z.object({
  name: z.string().min(1, { message: 'Website name cannot be empty.' }),
  url: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com).' }),
});
type BookmarkFormData = z.infer<typeof bookmarkSchema>;
export function HomePage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('bookmarks');
      if (savedBookmarks) {
        const parsedBookmarks: Bookmark[] = JSON.parse(savedBookmarks);
        const bookmarksWithPinStatus = parsedBookmarks.map(bm => ({
          ...bm,
          isPinned: bm.isPinned ?? false,
        }));
        setBookmarks(bookmarksWithPinStatus);
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage", error);
      toast.error("Could not load your bookmarks.");
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage", error);
      toast.error("Could not save your changes.");
    }
  }, [bookmarks]);
  const addForm = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: { name: '', url: '' },
  });
  const editForm = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarkSchema),
  });
  const onAddSubmit = (data: BookmarkFormData) => {
    const newBookmark: Bookmark = { id: uuidv4(), isPinned: false, ...data };
    setBookmarks(prev => [newBookmark, ...prev]);
    addForm.reset();
    toast.success('Bookmark added!');
  };
  const onEditSubmit = (data: BookmarkFormData) => {
    if (!editingBookmark) return;
    setBookmarks(prev =>
      prev.map(bm => (bm.id === editingBookmark.id ? { ...bm, ...data } : bm))
    );
    setEditingBookmark(null);
    toast.success('Bookmark updated!');
  };
  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    toast.info('Bookmark removed.');
  };
  const togglePin = (id: string) => {
    setBookmarks(prev =>
      prev.map(bookmark =>
        bookmark.id === id ? { ...bookmark, isPinned: !bookmark.isPinned } : bookmark
      )
    );
  };
  const handleOpenEditDialog = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    editForm.reset({ name: bookmark.name, url: bookmark.url });
  };
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery) return bookmarks;
    const lowercasedQuery = searchQuery.toLowerCase();
    return bookmarks.filter(
      bm =>
        bm.name.toLowerCase().includes(lowercasedQuery) ||
        bm.url.toLowerCase().includes(lowercasedQuery)
    );
  }, [bookmarks, searchQuery]);
  const sortedBookmarks = useMemo(() => {
    return [...filteredBookmarks].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [filteredBookmarks]);
  const pinnedBookmarks = useMemo(() => {
    return sortedBookmarks.filter(bookmark => bookmark.isPinned);
  }, [sortedBookmarks]);
  const renderBookmarkCard = (bookmark: Bookmark) => (
    <motion.div
      key={bookmark.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800",
        bookmark.isPinned && "border-2 border-indigo-500/50"
      )}>
        {bookmark.isPinned && (
          <div className="absolute top-2 right-2 text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-1.5">
            <Pin className="h-4 w-4" />
          </div>
        )}
        <CardContent className="flex flex-col p-6 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-8">{bookmark.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Link className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{bookmark.url}</span>
          </div>
        </CardContent>
        <div className="flex items-center justify-end space-x-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-3">
          <Button variant="ghost" size="icon" className={cn("h-8 w-8 text-slate-400 transition-colors duration-200 hover:bg-indigo-100 hover:text-indigo-500 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400", bookmark.isPinned && "text-indigo-500")} onClick={() => togglePin(bookmark.id)}>
            <Pin className={cn("h-4 w-4", bookmark.isPinned && "fill-current")} />
            <span className="sr-only">Pin bookmark</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" onClick={() => handleOpenEditDialog(bookmark)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit bookmark</span>
          </Button>
          <Button variant="outline" size="sm" asChild className="transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-700">
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">Visit</a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 transition-colors duration-200 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-400" onClick={() => deleteBookmark(bookmark.id)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Delete bookmark</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
  const renderEmptyState = (type: 'all' | 'pinned') => {
    const isSearching = searchQuery.length > 0;
    const messages = {
      all: {
        search: { icon: <Search className="h-8 w-8 text-slate-500 dark:text-slate-400" />, title: "No matching bookmarks", description: "Try a different search term." },
        default: { icon: <Link className="h-8 w-8 text-slate-500 dark:text-slate-400" />, title: "No bookmarks yet", description: "Add your first bookmark using the form above." },
      },
      pinned: {
        search: { icon: <Search className="h-8 w-8 text-slate-500 dark:text-slate-400" />, title: "No matching pinned bookmarks", description: "Try a different search term." },
        default: { icon: <Star className="h-8 w-8 text-slate-500 dark:text-slate-400" />, title: "No pinned bookmarks", description: "Click the pin icon on a bookmark to keep it here." },
      }
    };
    const { icon, title, description } = isSearching ? messages[type].search : messages[type].default;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="inline-block rounded-lg bg-slate-200 dark:bg-slate-800 p-4">{icon}</div>
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </motion.div>
    );
  };
  return (
    <>
      <ThemeToggle className="fixed top-4 right-4" />
      <main className="min-h-screen w-full font-sans text-slate-800 antialiased">
        <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
          <div className="flex flex-col space-y-12">
            <header className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Markit</h1>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">Your simple, minimalist bookmarking app.</p>
            </header>
            <section>
              <Card className="shadow-md dark:bg-slate-800">
                <CardContent className="p-6">
                  <Form {...addForm}>
                    <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField control={addForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300">Website Name</FormLabel>
                            <FormControl><Input placeholder="e.g. Cloudflare" {...field} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={addForm.control} name="url" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300">URL</FormLabel>
                            <FormControl><Input placeholder="https://www.cloudflare.com" {...field} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 active:scale-95 sm:w-auto">Add Bookmark</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </section>
            <section className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input placeholder="Search bookmarks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pinned">Pinned</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <AnimatePresence>
                    {sortedBookmarks.length > 0 ? (
                      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">{sortedBookmarks.map(renderBookmarkCard)}</motion.div>
                    ) : ( renderEmptyState('all') )}
                  </AnimatePresence>
                </TabsContent>
                <TabsContent value="pinned" className="mt-6">
                  <AnimatePresence>
                    {pinnedBookmarks.length > 0 ? (
                      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">{pinnedBookmarks.map(renderBookmarkCard)}</motion.div>
                    ) : ( renderEmptyState('pinned') )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>
      <Dialog open={!!editingBookmark} onOpenChange={(isOpen) => !isOpen && setEditingBookmark(null)}>
        <DialogContent className="sm:max-w-[425px] dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Bookmark</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">Website Name</FormLabel>
                  <FormControl><Input {...field} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="url" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">URL</FormLabel>
                  <FormControl><Input {...field} className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster richColors position="bottom-right" />
    </>
  );
}