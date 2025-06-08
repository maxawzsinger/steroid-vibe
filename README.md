# Steroid Vibe

A desktop GUI application for TypeScript and JavaScript minification.

## Download

Visit the [Releases](../../releases) page to download the latest version for your platform:

- **macOS**: Download the `.dmg` file for easy installation or `.zip` for portable use
- **Windows**: Download the `.exe` installer or `.zip` for portable use
- **Linux**: Download the `.AppImage` for portable use or `.tar.gz` for manual installation

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd steroid-vibe-electron
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm start
   ```

### Building

Build for your current platform:

```bash
npm run build
```

Build for specific platforms:

```bash
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

Built files will be in the `dist/` directory.

## Features

- TypeScript/JavaScript code minification
- Real-time file watching
- Cross-platform desktop application
- Modern, intuitive interface

## License

MIT
