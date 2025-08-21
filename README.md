# Chat Interface

## Merkle Science Frontend Assignment by Vibhor Sharma

A modern React-based chat interface built with TypeScript, Vite, and TanStack Router.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 20 or higher)
- **npm** or **yarn** package manager

You can check your Node.js version by running:

```bash
node --version
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/CaptainT33mo/merkle-science-fe-assignment-vibhor-sharma.git
cd merkle-science-fe-assignment-vibhor-sharma
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer using yarn:

```bash
yarn install
```

## Available Scripts

Once the dependencies are installed, you can run the following commands:

### Development

```bash
npm run dev
```

Starts the development server using Vite. The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Building for Production

```bash
npm run build
```

Creates a production build of the application in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

### Testing

```bash
npm test
```

Runs the test suite using Vitest.

```bash
npm run test:ui
```

Runs tests with the Vitest UI interface.

```bash
npm run test:coverage
```

Runs tests and generates coverage reports.

### Linting

```bash
npm run lint
```

Runs ESLint to check for code quality issues.

## Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared components (header, sidebar, rich text editor)
│   ├── icons/          # Icon components
│   ├── images/         # Image components
│   ├── pages/          # Page-specific components
│   │   ├── chat/       # Chat interface components
│   │   └── settings/   # Settings page components
│   └── ui/             # UI components (buttons, etc.)
├── lib/                # Utility libraries and configurations
├── routes/             # TanStack Router route definitions
├── store/              # Zustand state management
└── test/               # Test utilities and setup
```

## Key Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Vitest** - Testing framework
- **TipTap** - Rich text editor
- **Radix UI** - Accessible UI primitives

## Getting Started

1. Follow the setup instructions above
2. Run `npm run dev` to start the development server
3. Open your browser and navigate to the provided localhost URL
4. Start exploring the chat interface!

## Contributing

1. Make sure all tests pass: `npm test`
2. Ensure code follows linting rules: `npm run lint`
3. Build the project to check for any build issues: `npm run build`
