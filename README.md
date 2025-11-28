# E-Commerce Analytics Dashboard

A modern, dark-themed analytics dashboard for e-commerce data built with React, TypeScript, and Tailwind CSS. Features real-time data visualization, product and order management with a stunning glassmorphism UI.

![Dashboard Preview](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)

## ✨ Features

- 📊 **Real-time Analytics Dashboard** - View total orders, revenue, and trends
- 📦 **Product Management** - Browse, search, and add new products
- 🛒 **Order Management** - View, filter, and create new orders
- 🎨 **Dark Theme UI** - Modern glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔄 **Dynamic Forms** - Add products and orders with validation
- 💰 **Auto-calculation** - Automatic total calculation for orders

## 🚀 Tech Stack

- **Frontend Framework:** React 18.3 with TypeScript
- **Routing:** React Router DOM 7.9
- **Styling:** Tailwind CSS 3.4 with custom animations
- **Charts:** Recharts 3.5
- **Icons:** Lucide React
- **Build Tool:** Vite 5.4
- **Backend API:** FastAPI (Python) - [Deployed on Render](https://python-data-pipelinee.onrender.com)

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd e-commerse-python/project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
VITE_API_BASE_URL=https://python-data-pipelinee.onrender.com
```

> **Note:** For local development, the proxy is configured in `vite.config.ts` to bypass CORS issues.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🌐 Deployment

### Deploy to Vercel

#### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://python-data-pipelinee.onrender.com`

#### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New Project"

4. Import your GitHub repository

5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. Add Environment Variable:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://python-data-pipelinee.onrender.com`

7. Click "Deploy"

### Deploy to Netlify

1. Push code to GitHub (same as above)

2. Go to [Netlify Dashboard](https://app.netlify.com/)

3. Click "Add new site" → "Import an existing project"

4. Connect to GitHub and select your repository

5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

6. Add environment variable:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = `https://python-data-pipelinee.onrender.com`

7. Click "Deploy site"

## 📁 Project Structure

```
project/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Orders.tsx
│   │   ├── AddProduct.tsx
│   │   └── AddOrder.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── config.ts        # Configuration
│   ├── index.css        # Global styles
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── .env.example         # Environment variables template
├── vercel.json          # Vercel configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies
```

## 🎨 Features Overview

### Dashboard
- Total orders and revenue cards with gradient backgrounds
- Revenue trend chart with interactive tooltips
- Top products table

### Products Page
- Search functionality by SKU or name
- Pagination for large datasets
- Stock status indicators
- Add new products with validation

### Orders Page
- Filter by amount and date range
- Order details modal
- Create new orders with:
  - Dynamic item addition/removal
  - Automatic total calculation
  - Product dropdown with prices

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🌍 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Production only | `/api` (local dev) |

## 📝 API Endpoints

The frontend connects to the following backend endpoints:

- `GET /` - Health check
- `GET /products/` - Fetch all products
- `GET /orders/` - Fetch all orders
- `GET /analytics/summary` - Fetch analytics data
- `POST /products/bulk-ingest` - Add new products
- `POST /orders/bulk-ingest` - Add new orders

## 🎯 Key Features Implementation

### Dark Theme
- Glassmorphism effects with backdrop blur
- Gradient text and backgrounds
- Custom animations (fadeInUp, scaleIn, slideInRight)
- Smooth transitions and hover effects

### Form Validation
- Required field validation
- Price and quantity validation
- SKU validation against product database
- Real-time error messages

### CORS Handling
- Vite proxy for local development
- Environment-based API URL configuration

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors in production, ensure:
1. Backend has proper CORS headers configured
2. `VITE_API_BASE_URL` is set correctly in Vercel/Netlify

### Build Errors
If build fails:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear cache: `npm run build -- --force`

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`
- In Vercel/Netlify, redeploy after adding variables

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
