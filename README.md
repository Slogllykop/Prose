# 📝 Prose Blogging Platform

Prose is a modern, lightweight, and fully file based blogging platform. It is built for developers who want to write content in MDX and have it served instantly without relying on a database. Enjoy a seamless writing experience powered by the latest web technologies.

## ✨ Features

* **File Based Routing:** Every blog is a folder containing an MDX file.
* **Markdown and MDX:** Write content with React components seamlessly.
* **Outstanding Typography:** Beautiful, automatic text formatting provided out of the box.
* **Dynamic Images:** Serve your hero images directly from your blog folders.
* **Code Highlighting:** Professional snippet styling using Shiki.
* **API Access:** Includes public data endpoints supporting CORS and caching.

## 🛠️ Project Stack

Our architecture is crafted using the best modern tools available:

* **Frontend:** Next.js 16 featuring App Router alongside React 19 and TypeScript.
* **Styling:** We use Tailwind v4 bundled with the official typography plugin. Our user interfaces are built with Shadcn UI components and Tabler Icons.
* **Content Parsing:** MDX compilation is enhanced using gray matter for YAML frontmatter extraction, alongside plugins like rehype slug and remark gfm.
* **Code Quality:** Local formatting and linting are maintained entirely by Biomejs.

## 🚀 How to Self Host

Hosting this project is straightforward. Follow these steps to get your own version running locally or on a production server:

### 1. Clone the Repository
Clone the repository to your local machine or server to get started:
```bash
git clone https://github.com/Slogllykop/Prose.git
cd Prose
```

### 2. Install Dependencies
Make sure you have `pnpm` installed fully. Install all required dependencies using the following command:
```bash
pnpm install
```

### 3. Personalize Site Data
All of your global metadata, branding, and author details reside in the constants file located at `src/lib/constants.ts`. Update this file with your own site title, site description, author name, and SEO keywords to truly make the blog yours. 

### 4. Remove Dummy Content
To delete the existing test content, we provide a clean script. Run the custom Node.js script to delete every blog folder except the example one:
```bash
pnpm run clean
```

### 5. Create Your Content
Create your own blog posts by making new folders inside the `src/blogs` directory. Inside your new folder, add a `blog.mdx` file. Define the YAML frontmatter with your title, description, date, and updated fields. If you want a hero cover, copy a `hero.png` into this newly created folder which renders nicely into a sixteen by seven aspect ratio.

### 6. Development and Review
Check your changes locally by starting the development server:
```bash
pnpm run dev
```

### 7. Build and Deploy
When you are ready, build the project for production:
```bash
pnpm run build
```
Start the production server using:
```bash
pnpm run start
```

You can deploy this project easily to standard node environments by connecting your repository and setting the build command to `pnpm run build`.

## 🧹 Code Maintenance

Remember to correctly format the code and sort Tailwind classes nicely before you commit any changes to version control. Simply run:
```bash
pnpm run format
```
