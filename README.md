# Modern Blogging Platform

A full-featured, modern blogging platform built with React, Vite, and Supabase. This application allows users to authenticate via Google, manage their own blog posts with full CRUD functionality, and interact with content through likes, bookmarks, and comments. It also features an AI-powered assistant to help writers craft better titles.

## Hosted Site 
https://bloggingplatformmanvith.netlify.app/

> **Note**: You can add the link to your hosted application here.

## Demo Video

> **Note**: You can add a link to your screen recording or demo video here.

---

## 🌟 Features Implemented

This platform includes a wide range of features, covering core functionalities as well as advanced bonus features.

### Core Features
- **User Authentication**: Secyure and simple sign-in/sign-out with Google, powered by Supabase Auth.
- **CRUD for Blogs**:
  - **Create**: A dedicated page to write and publish new blog posts.
  - **Read**: A clean, full-screen view for reading blog posts.
  - **Update**: Users can easily edit their existing posts.
  - **Delete**: Users can delete their own posts with a confirmation step.
- **Responsive Design**: The user interface is designed to be fully responsive and accessible on various devices.

### Bonus Features
- **User-Specific Content**:
  - **Profile Page**: Displays the logged-in user's name and information.
  - **My Blogs Page**: A personalized, grid-based view of the user's own blog posts, featuring infinite scroll for seamless browsing.
- **Social & Engagement**:
  - **Liking System**: Users can "like" posts to show appreciation.
  - **Bookmarking**: Logged-in users can bookmark their favorite articles and view them on a dedicated "Bookmarked Blogs" page.
  - **Commenting System**: A complete comment section under each blog post for user discussions, showing who posted the comment and when.
- **Discovery & Search**:
  - **Popular Blogs Section**: The home page highlights the most-liked blogs, providing visibility to popular content.
  - **Search Functionality**: A search bar is integrated into the header to allow users to find blogs by title.
- **AI-Powered Writing Assistant**:
  - **Title Suggestions**: When creating a blog, a "Suggest Titles" button uses the Google Gemini API to provide 5 alternative, engaging, and SEO-friendly titles based on the user's draft title.

---

## ⚙️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Styling**: SCSS
- **Backend & Database**: Supabase (PostgreSQL, Auth)
- **State Management**: Redux Toolkit
- **AI**: Google Gemini API

---

## 🚀 Application Workflow

1.  A new user lands on the home page, which presents a welcoming hero section and a list of popular blogs from all users.
2.  The user can sign in using their Google account via a single click.
3.  Once authenticated, the user's profile picture appears in the header. Clicking it reveals a dropdown menu with links to their **Profile**, **My Blogs**, **Bookmarked Blogs**, and a **Logout** option.
4.  To create a post, the user clicks the "Write" button.
5.  In the blog editor, they can write a title and the main content. If they need inspiration for a title, they can type a draft and click **"✨ Suggest Titles"**. The AI will generate five alternatives, which can be selected to auto-fill the title field.
6.  After publishing, the new blog appears on the "My Blogs" page.
7.  From the "My Blogs" page, the user has options to **Update** or **Delete** each of their posts.
8.  Any user (logged-in or not) can read a blog post. Logged-in users can **Like**, **Bookmark**, and **Comment** on posts.

---

## 🎨 Architecture & Design Choices

### State Management

**Redux Toolkit** has been integrated as the state management solution. A basic store and an example `uiSlice` are set up as a foundation, providing a scalable pattern for managing global application state as the application grows in complexity.

### Component Styling

**SCSS** is used for creating custom, reusable components. A prime example is the `CustomButton` component, which is styled with SCSS to provide different variants (`primary`, `secondary`, `danger`, etc.) for a consistent look and feel across the application. This approach separates component-specific styles from the utility-first classes provided by Tailwind CSS.

---

## 🛠️ Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/Manvith-Reddy06/Blogging-Platform.git
cd blog-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add your Supabase and Google Gemini API credentials.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 4. Set Up Supabase Database

Log in to your Supabase account and run the following SQL queries in the SQL Editor to create the necessary tables.

**`blogs` table:**
```sql
CREATE TABLE blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  author_email TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**`bookmarks` table:**
```sql
CREATE TABLE bookmarks (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, blog_id)
);
```

**`comments` table:**
```sql
CREATE TABLE comments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 5. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

---

## 🤖 AI Integration & Development Process

Artificial Intelligence played a significant role as a coding assistant and a feature-driver in this project.

### Development Workflow

1.  **Core Functionality First**: The initial phase focused on building the core CRUD (Create, Read, Update, Delete) functionalities for blogs without AI assistance. This established a solid foundation for the application. The "Popular Blogs" section was also implemented manually during this phase by sorting posts based on their "likes" count.

2.  **AI-Assisted Refinement & Feature Expansion**: After the core was stable, AI coding assistants (**Gemini CLI**, **ChatGPT**, and **Trae AI**) were used to accelerate development, debug issues, and implement new features.
    - **Authentication**: I used AI to help implement the Google OAuth flow with Supabase. This included handling the session data, displaying the user's profile picture in the header, and creating the user dropdown menu.
    - **UI/UX Adjustments**: Prompts were frequently used to solve layout challenges, such as centering pages, fixing flexbox issues, and making the UI responsive.
    - **New Features**: For features like the comment and bookmarking systems, I prompted the AI to help generate the initial Supabase SQL schemas and the React component structure. This provided a great starting point, which I then refined.

### Generative AI Feature: Title Suggestions

The most prominent AI feature is the title suggestion tool in the blog editor.

- **Prompting Technique**: The key to this feature was crafting a precise prompt for the Google Gemini API. The prompt instructs the model to act as an **"expert copywriter"** and to generate **"5 alternative, more engaging and SEO-friendly titles"** based on a user's draft. Crucially, the prompt specifies that the output must be a **JSON array of strings**. This structured output is vital for easy and reliable parsing on the frontend.

- **Integration**: AI assistance was used to integrate the `@google/generative-ai` SDK, manage the asynchronous API call (including loading and error states), and dynamically render the suggestions for the user to select.

### Challenges Faced & How AI Helped

- **API and Dependency Errors**: I encountered several technical errors during development.
  - A `504 (Outdated Optimize Dep)` error from Vite was resolved by getting help from the AI to create a `vite.config.js` file and force-re-bundle dependencies.
  - A `404 model not found` error from the Gemini API was fixed by prompting the AI for the latest recommended model name (`gemini-1.5-flash`).
- **Database Schema Design**: My initial idea for bookmarks was a simple boolean on the `blogs` table. AI helped me realize a more scalable many-to-many approach using a dedicated `bookmarks` table was better. It also helped debug a `bigint` vs. `uuid` type mismatch in the foreign key constraint.
- **Layout Inconsistencies**: Achieving a consistent, centered, and responsive layout across all pages was challenging. I used AI to debug CSS and provide the correct Tailwind CSS classes to fix these issues.