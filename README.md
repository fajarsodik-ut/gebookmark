# Markit: The Minimalist Bookmarking App

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fajarsodik-ut/gebookmark)

Markit is a modern, minimalist, and user-friendly single-page bookmarking web application. It allows users to effortlessly save, view, and manage their favorite websites. The entire application is built with a focus on simplicity and visual clarity, running entirely in the browser without any backend. All data is persistently stored in the browser's localStorage, ensuring bookmarks are available on subsequent visits. The interface consists of a clean header, an intuitive form for adding new bookmarks, and a dynamic list of saved bookmarks displayed as elegant cards.

## Key Features

- **Modern & Minimalist UI**: Clean, single-column, centered layout that is fully responsive.
- **Local Storage Persistence**: All bookmarks are saved directly in your browser. No account needed.
- **Add & Delete Bookmarks**: Easily add new bookmarks and remove them with a single click.
- **URL Validation**: Ensures that submitted URLs are correctly formatted.
- **Interactive Feedback**: Smooth animations and toast notifications for a great user experience.
- **One-Click Visit**: Open saved bookmarks in a new tab directly from the dashboard.

## Technology Stack

- **Framework**: React (with Vite)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Validation**: Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deployment**: Cloudflare Pages & Workers

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/markit.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd markit
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running Locally

To start the development server, run the following command:

```sh
bun dev
```

The application will be available at `http://localhost:3000`.

## Development

The main application logic is self-contained within `src/pages/HomePage.tsx`. This file includes the UI, state management, validation, and localStorage integration.

- **Styling**: Modify Tailwind CSS classes directly in the component files. For theme-level changes (e.g., colors, fonts), edit `tailwind.config.js`.
- **Components**: Reusable UI components are sourced from `shadcn/ui` and can be found in `src/components/ui`.
- **Linting**: To check for code quality and style issues, run:
  ```sh
  bun run lint
  ```

## Deployment

This project is configured for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    ```sh
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    The `deploy` script in `package.json` handles both the build and deployment process.
    ```sh
    bun run deploy
    ```
    This will trigger the Wrangler CLI to deploy your application.

Alternatively, you can connect your GitHub repository to Cloudflare Pages for automatic deployments on every push.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fajarsodik-ut/gebookmark)