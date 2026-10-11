# bazardor-app-a7

**বাজার দর (BazarDor)** is a Bangla-first, responsive market-price browsing web application. It helps users explore everyday grocery prices, compare price changes, browse products by category, and view product price summaries in a simple interface.

> **Note:** Product prices are informational and may vary by market and location.

## ✨ Key Features

1. **Responsive design** — layouts adapt to mobile, tablet, and desktop screens.
2. **Market price ticker** — a scrolling strip highlights products and their price movements.
3. **Price trend sections** — quickly view products whose prices have increased or decreased.
4. **Product catalogue** — browse product cards with Bangla names, units, prices, and change indicators.
5. **Category browsing and sorting** — explore products by category and sort prices from low to high or high to low.
6. **Product details** — view a product summary with minimum, maximum, and average price information where available.
7. **Authentication** — sign-up and sign-in forms powered by Better Auth, with optional social providers when configured.
8. **Profile management** — view profile information and update the user's name.
9. **Helpful feedback states** — loading skeletons, empty states, toast notifications, and a friendly 404 page.

## 🧰 Technologies Used

| Technology | Purpose |
| --- | --- |
| [Next.js 15](https://nextjs.org/) | App Router, page rendering, and routing |
| [React 19](https://react.dev/) | Interactive UI components |
| JavaScript (JSX) | Application logic and components |
| [Tailwind CSS v4](https://tailwindcss.com/) + custom CSS | Responsive styling and layout |
| [Better Auth](https://www.better-auth.com/) | Authentication integration |
| [React Hot Toast](https://react-hot-toast.com/) | Success and error notifications |
| [Lucide React](https://lucide.dev/) | Interface icons |
| BazarDor API | Category and product data |

## 📄 Main Pages and Routes

- `/` — Home page, market ticker, price trends, and product catalogue
- `/category/[slug]` — Products for a selected category, including sorting
- `/product/[slug]` — Product details (login required)
- `/signin` — Sign-in page
- `/signup` — Registration page
- `/profile` — User profile
- `/profile/update` — Update profile information
- Unknown routes — Friendly 404 page with a link back to the home page

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A configured Better Auth database adapter for persistent production authentication

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values required by your setup. At minimum, configure the Better Auth secret and application URL. Never commit real secrets or OAuth credentials to GitHub.

```bash
# Example only — use your own secure values
BETTER_AUTH_SECRET=replace_with_a_secure_secret
BETTER_AUTH_URL=http://localhost:3000
```

If you enable Google or GitHub sign-in, configure the relevant OAuth client credentials and callback URLs in the provider dashboards and your local environment.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create a production build

```bash
npm run build
npm start
```

## 🌐 API

The application uses the BazarDor API for category and product data.

Base URL: `https://api.abcz.workers.dev/api/bazardor`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/categories` | Retrieve categories |
| `GET` | `/categories/chal` | Retrieve a category's data |
| `GET` | `/products` | Retrieve products |
| `GET` | `/products?category=chal` | Filter products by category |
| `GET` | `/products/1` | Retrieve a product by ID |

## 🔐 Authentication Setup

The project integrates Better Auth for authentication. To use authentication reliably in production:

- Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in the deployment environment.
- Configure a supported Better Auth database adapter for persistent users and sessions.
- Add Google and/or GitHub OAuth credentials if social login is enabled.
- Configure each OAuth provider's callback URL for your deployed domain.
- Test sign-in, sign-up, sign-out, protected routes, and profile updates before submission.

## ☁️ Deployment

This project can be deployed to [Vercel](https://vercel.com/) or another platform that supports Next.js.

1. Push the project to a GitHub repository.
2. Import the repository into your deployment provider.
3. Add the required environment variables in the provider's project settings.
4. Configure the production database and OAuth callbacks, if applicable.
5. Deploy, then test the home page, category routes, product detail routes, authentication, and direct page refreshes.


## 📌 Disclaimer

Market prices are indicative and can change depending on location, seller, supply, and demand. Always confirm the current price with the relevant market or seller.

---

Made with ❤️ for easier access to everyday market prices.
