# Steps Home (`steps-home`)

A modern Next.js web application for **Steps Home**, designed to provide seamless experiences with dynamic UI components, database integration, and payment services.

## 🚀 Features

- **Framework**: Built with Next.js 15 (App Router) and React 19.
- **Styling**: Tailwind CSS v4 for utility-first responsive styling.
- **UI & Animations**: Lucide icons, dynamic UI components, and smooth transitions powered by Framer Motion.
- **Database & ORM**: Prisma ORM with Neon serverless Postgres adapter.
- **Payments Integration**: Razorpay integration.
- **Type Safety**: Full TypeScript support with Zod validation.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Motion
- **Backend & Database**: Next.js Server Actions/API Routes, Prisma ORM, Neon Postgres
- **Integrations**: Razorpay

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have Node.js (v18+) installed or Bun package manager.

### 1. Clone the repository

```bash
git clone https://github.com/thebusiness-company/stepshome.git
cd stepshome
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and configure your environment variables based on `.env.example`:

```env
DATABASE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📜 Available Scripts

- `npm run dev` - Starts the development server (`0.0.0.0:3000`).
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs Next.js linter check.

---

## 📄 License

Private - All rights reserved.
