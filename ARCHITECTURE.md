# Supabase Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Markit React App                         │  │
│  │                                                       │  │
│  │  ┌─────────────────┐      ┌──────────────────────┐  │  │
│  │  │  HomePage.tsx   │ ───> │ bookmarkService.ts  │  │  │
│  │  │  (UI Component) │      │ (Business Logic)    │  │  │
│  │  └─────────────────┘      └──────────────────────┘  │  │
│  │           │                         │                │  │
│  │           │                         ▼                │  │
│  │           │                  ┌─────────────┐        │  │
│  │           │                  │ supabase.ts │        │  │
│  │           │                  │  (Client)   │        │  │
│  │           │                  └─────────────┘        │  │
│  │           │                         │                │  │
│  │           ▼                         │                │  │
│  │    ┌─────────────┐                │                │  │
│  │    │ localStorage│                │                │  │
│  │    │  user_id    │────────────────┘                │  │
│  │    └─────────────┘                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Cloud                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  PostgreSQL Database                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              bookmarks Table                    │  │  │
│  │  │  ┌──────────────────────────────────────────┐  │  │  │
│  │  │  │ id │ name │ url │ is_pinned │ user_id  │  │  │  │
│  │  │  ├────┼──────┼─────┼───────────┼──────────┤  │  │  │
│  │  │  │ 1  │ Gh.. │ ... │   true    │  uuid123 │  │  │  │
│  │  │  │ 2  │ Gt.. │ ... │   false   │  uuid123 │  │  │  │
│  │  │  └──────────────────────────────────────────┘  │  │  │
│  │  │                                                 │  │  │
│  │  │  Row Level Security (RLS) Policies:            │  │  │
│  │  │  ✓ Users can only see their own bookmarks     │  │  │
│  │  │  ✓ Users can only modify their own bookmarks  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Adding a Bookmark

```
User clicks "Add Bookmark"
         │
         ▼
  [HomePage.tsx]
   onAddSubmit()
         │
         ▼
[bookmarkService.ts]
  addBookmark(name, url)
         │
         ├─ Get user_id from localStorage
         │
         ▼
  [supabase.ts]
  supabase.from('bookmarks').insert({
    name, url, is_pinned: false, user_id
  })
         │
         ▼
  [Supabase Cloud]
    INSERT INTO bookmarks...
    RLS Policy Check: ✓ user_id matches
         │
         ▼
    Return new bookmark
         │
         ▼
  [HomePage.tsx]
    setBookmarks([newBookmark, ...prev])
    toast.success("Bookmark added!")
         │
         ▼
    UI Updates ✅
```

### Loading Bookmarks

```
Page loads
    │
    ▼
[HomePage.tsx]
 useEffect(() => { loadBookmarks() })
    │
    ▼
[bookmarkService.ts]
 fetchBookmarks()
    │
    ├─ Get user_id from localStorage
    │
    ▼
[supabase.ts]
 supabase.from('bookmarks')
   .select('*')
   .eq('user_id', userId)
   .order('created_at', desc)
    │
    ▼
[Supabase Cloud]
  SELECT * FROM bookmarks
  WHERE user_id = 'uuid123'
  RLS Policy Check: ✓ user_id matches
    │
    ▼
  Return bookmarks array
    │
    ▼
[HomePage.tsx]
  setBookmarks(data)
  setIsLoading(false)
    │
    ▼
  Display bookmarks ✅
```

### User ID Generation

```
First Visit to App
       │
       ▼
  Check localStorage
  for 'markit_user_id'
       │
       ├─ Found? ──> Use existing ID
       │
       └─ Not Found? ──> Generate new UUID
                          │
                          ▼
                    crypto.randomUUID()
                    "a1b2c3d4-e5f6-..."
                          │
                          ▼
                  Store in localStorage
                  key: 'markit_user_id'
                          │
                          ▼
              All requests use this ID
```

## Security Model

### Row Level Security (RLS)

```
┌────────────────────────────────────────┐
│         User A (user_id: abc123)       │
│  Can only access bookmarks where       │
│  user_id = 'abc123'                    │
└────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│       PostgreSQL Database              │
│                                        │
│  Bookmarks:                            │
│  ┌─────┬──────┬─────────┐             │
│  │ id  │ name │ user_id │             │
│  ├─────┼──────┼─────────┤             │
│  │ 1   │ AAA  │ abc123  │ ✅ Visible  │
│  │ 2   │ BBB  │ abc123  │ ✅ Visible  │
│  │ 3   │ CCC  │ xyz789  │ ❌ Hidden   │
│  │ 4   │ DDD  │ xyz789  │ ❌ Hidden   │
│  └─────┴──────┴─────────┘             │
└────────────────────────────────────────┘
```

### Environment Variables

```
Development (.env)
├─ VITE_SUPABASE_URL
└─ VITE_SUPABASE_ANON_KEY
         │
         ├─ Not committed to Git (in .gitignore)
         └─ Different for each developer

Production (Netlify)
├─ VITE_SUPABASE_URL
└─ VITE_SUPABASE_ANON_KEY
         │
         └─ Managed in Netlify Dashboard
            Environment Variables section
```

## Migration Flow

```
User opens updated app
         │
         ▼
   Check localStorage
   for 'bookmarks' key
         │
         ├─ Found? ──────────┐
         │                   │
         └─ Not Found? ──> Continue normally
                             │
                             ▼
         ┌──────────────────┐
         │ Old Data Exists  │
         └──────────────────┘
                 │
                 ▼
    Show toast: "Migrating bookmarks..."
                 │
                 ▼
    For each old bookmark:
         │
         ▼
    INSERT INTO supabase
    (name, url, is_pinned, user_id)
         │
         ▼
    All migrated successfully?
         │
         ├─ Yes ──> Delete localStorage['bookmarks']
         │          toast.success("Migration complete!")
         │
         └─ Error ──> Keep localStorage backup
                      toast.error("Migration failed")
```

## Component Architecture

```
HomePage.tsx
├── State Management
│   ├── bookmarks: Bookmark[]
│   ├── isLoading: boolean
│   ├── isSyncing: boolean
│   ├── searchQuery: string
│   └── editingBookmark: Bookmark | null
│
├── Effects
│   └── useEffect(() => loadBookmarks(), [])
│       ├── Check for old localStorage data
│       ├── Migrate if needed
│       └── Fetch from Supabase
│
├── Computed Values (useMemo)
│   ├── filteredBookmarks (by search)
│   ├── sortedBookmarks (pinned first)
│   └── pinnedBookmarks (filtered)
│
├── Event Handlers
│   ├── onAddSubmit() → addBookmark()
│   ├── onEditSubmit() → updateBookmark()
│   ├── deleteBookmark() → deleteBookmark()
│   └── togglePin() → togglePin()
│
└── UI Components
    ├── Header (with cloud sync badge)
    ├── Add Form
    ├── Search Bar
    ├── Tabs (All / Pinned)
    ├── Bookmark Cards
    └── Edit Dialog
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts
│   │   └── Purpose: Initialize Supabase client
│   │       Exports: supabase, Database types
│   │
│   └── bookmarkService.ts
│       └── Purpose: All database operations
│           Exports: fetchBookmarks, addBookmark,
│                    updateBookmark, deleteBookmark,
│                    togglePin, migrateLocalBookmarks
│
└── pages/
    └── HomePage.tsx
        └── Purpose: Main UI component
            Uses: bookmarkService for all data operations
            Features: Loading states, error handling,
                     toast notifications
```

## API Functions Reference

```typescript
// Fetch all bookmarks for current user
await fetchBookmarks()
// Returns: Bookmark[]

// Add new bookmark
await addBookmark(name: string, url: string)
// Returns: Bookmark | null

// Update existing bookmark
await updateBookmark(id: string, updates: {
  name?: string,
  url?: string,
  isPinned?: boolean
})
// Returns: boolean

// Delete bookmark
await deleteBookmark(id: string)
// Returns: boolean

// Toggle pin status
await togglePin(id: string, currentStatus: boolean)
// Returns: boolean

// Migrate localStorage to Supabase
await migrateLocalBookmarks()
// Returns: void
```

---

This architecture ensures:
✅ Separation of concerns (UI, business logic, data access)
✅ Type safety with TypeScript
✅ Secure data access with RLS
✅ Smooth user experience with loading states
✅ Easy maintenance and testing
