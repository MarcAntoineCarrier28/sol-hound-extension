# SolHound Extension

<p align="center">
  <img src="public/icon/128.png" alt="SolHound Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Detect and highlight Solana contract addresses on any webpage</strong>
</p>

<p align="center">
  <a href="https://www.solhound.xyz" target="_blank">Website</a> •
  <a href="https://twitter.com/Solana_Hound" target="_blank">Twitter</a> •
  <a href="https://discord.gg/aU6rKnBs" target="_blank">Discord</a>
</p>

## 🚀 Overview

SolHound is a browser extension that automatically detects and highlights Solana contract addresses (CAs) on any webpage. It enhances your browsing experience by making Solana addresses interactive with customizable highlighting styles and useful click actions.

## ✨ Key Features

- **Automatic Address Detection**: Identifies Solana contract addresses and wallet addresses across all websites
- **Beautiful Highlighting**: Applies eye-catching, animated gradient highlights to make addresses stand out
- **Customizable Styles**: Choose from preset styles or create your own custom gradient animations
- **Interactive Click Actions**: 
  - Copy addresses with a single click
  - Redirect to your preferred trading platform or explorer (Axiom, BullX, Photon, Dex Screener, etc.)
  - Different explorers for token vs. wallet addresses
- **Performance Optimized**: Uses efficient DOM observation techniques to minimize impact on page loading

## 🛠️ Technology Stack

- **Framework**: [WXT](https://wxt.dev/) (Web Extension Tools)
- **UI Library**: React with TypeScript
- **Styling**: TailwindCSS
- **Building**: Vite
- **Store**: Chrome Web Store

## 📁 Project Structure

```
SolHound Extension
├── src/                        # Source code
│   ├── assets/                 # CSS and other static assets
│   │   ├── content.css         # Styles for content script highlights
│   │   └── tailwind.css        # Tailwind CSS configuration
│   ├── components/             # React components
│   │   ├── feature-toggle.tsx  # Toggle switch component
│   │   ├── header.tsx          # Extension header
│   │   ├── highlight-style-customizer.tsx # Style customization UI
│   │   ├── social-links.tsx    # Social media links
│   │   ├── token-redirect-selector.tsx # Token explorer selector
│   │   └── wallet-redirect-selector.tsx # Wallet explorer selector
│   ├── data/                   # Data and constants
│   │   └── const.ts            # Token/wallet explorers and highlight presets
│   ├── entrypoints/           # Extension entry points
│   │   ├── content.ts          # Content script for page scanning
│   │   ├── highlighting.ts     # Address highlighting implementation
│   │   └── popup/              # Popup UI
│   │       ├── App.tsx         # Main popup component
│   │       └── main.tsx        # Popup entry point
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuthStatus.ts    # Authentication state management
│   │   └── useFeatureToggles.ts # Feature toggle state management
│   └── utils/                  # Utility functions
│       ├── address-verification.ts # Solana address verification
│       ├── auth-storage.ts     # Auth state persistence
│       ├── environment.ts      # Environment configuration
│       └── feature-storage.ts  # Feature toggle persistence
├── wxt.config.ts               # WXT configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🔍 How It Works

SolHound uses a content script that scans web pages for text patterns matching Solana contract addresses. When addresses are found:

1. **Detection**: Uses regex pattern matching to find potential Solana addresses
2. **Verification**: Verifies addresses and determines if they are tokens or wallets  
3. **Highlighting**: Wraps matched addresses in styled elements with animated gradients
4. **Interaction**: Adds click handlers for copying or redirecting to explorers

The extension uses Shadow DOM to ensure the highlighting styles don't interfere with the website's own CSS.

## 🚧 Local Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sol-hound-extension.git
   cd sol-hound-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Load the extension in your browser:
   - Chrome: Go to `chrome://extensions/`, enable Developer mode, and click "Load unpacked" to select the `.output/chrome-mv3` directory
   - Firefox: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file from the `.output/firefox-mv2` directory

### Build

```bash
# Development build
npm run build --mode=development

# Production build
npm run build --mode=production
```

## 🧪 Testing

```bash
# Run tests
npm test

# Build and test in Chrome
npm run dev:chrome

# Build and test in Firefox
npm run dev:firefox
```

## 📦 Building for Distribution

```bash
# Build for production
npm run build --mode=production

# Create a ZIP file for store submission
npm run zip
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use functional components with hooks for React components
- Follow TypeScript best practices with proper typing
- Use camelCase for variables and functions, PascalCase for components
- Write clear, descriptive comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [WXT](https://wxt.dev/) for the excellent web extension framework
- [Solana](https://solana.com/) ecosystem and community
- All contributors and users of SolHound!

---

Built with ❤️ for the Solana community.