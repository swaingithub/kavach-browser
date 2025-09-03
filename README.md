# Kavach - Modern Electron Browser

Kavach is a modern, lightweight web browser built with Electron, React, and Vite. It provides a fast and customizable browsing experience with a clean, intuitive interface.

![Kavach Browser](public/vite.svg)

## Features

- 🚀 Built with Electron for cross-platform compatibility
- ⚡ Powered by Vite for fast development and building
- 🎨 Modern UI with React and Tailwind CSS
- 🌐 Standard browser features including navigation, tabs, and more
- 🔄 Hot Module Replacement (HMR) for rapid development

## Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kavach.git
   cd kavach
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   This will start both the Vite development server and Electron app.

4. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

- `main.cjs` - Main Electron process
- `preload.cjs` - Preload script for Electron
- `src/` - React application source code
  - `components/` - Reusable React components
  - `assets/` - Static assets
  - `App.jsx` - Main application component

## Development

- **Development Mode**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview Production Build**: `npm run preview`

## Technologies Used

- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful, consistent icons

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

👤 **Rakesh Swain**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
