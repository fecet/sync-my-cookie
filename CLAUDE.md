# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `yarn install` - Install all dependencies
- `yarn build` - Build production bundle (cleans build directory first)
- `yarn dev:chrome` - Development mode with file watching for Chrome extension
- `yarn dev:web` - Run webpack dev server for web development
- `yarn clean` - Remove all build artifacts

### Code Quality
- `yarn lint` - Run TSLint to check TypeScript code quality

## Architecture Overview

This is a Chrome extension for synchronizing cookies across devices using GitHub Gist as encrypted storage.

### Core Technologies
- **TypeScript** - Primary language for all source code
- **React** - UI framework for popup and options pages
- **Ant Design** - Component library for UI elements
- **Webpack** - Build system with separate configurations for popup, options, and background scripts
- **Kevast** - Key-value storage abstraction library for Chrome storage and Gist integration

### Project Structure
- `src/background.ts` - Background script handling auto-merge (on browser start) and auto-push (on cookie changes) with debouncing
- `src/popup.tsx` - Main popup UI for manual push/merge operations and domain management
- `src/options.tsx` - Options page for configuring GitHub token, password, and Gist settings
- `src/utils/` - Core utilities:
  - `chrome.ts` - Cookie import/export and Chrome API interactions
  - `store.ts` - Storage management using Kevast (Chrome sync for settings, Gist for cookies)
  - `keys.ts` - Storage key constants
- `src/components/` - React components:
  - `domain/` - Individual domain item display
  - `domain-list/` - List of saved domains with actions
  - `setting/` - Settings configuration component
  - `console/` - Console output display

### Key Implementation Details

1. **Cookie Synchronization Flow**:
   - Cookies are encrypted with AES-128-CBC before storage in GitHub Gist
   - Auto-merge runs when browser starts for configured domains
   - Auto-push uses debouncing (10 seconds) to batch cookie changes
   - Manual push/merge available through extension popup

2. **Storage Architecture**:
   - Settings (token, password, gist ID, filename) stored in Chrome sync storage
   - Cookie data stored in GitHub Gist with encryption
   - Local Chrome storage used for caching and auto-configuration

3. **Build Process**:
   - Three separate webpack entry points: popup, options, background
   - HTML generation for React pages using HtmlWebpackPlugin
   - Lodash optimization with LodashModuleReplacementPlugin
   - CSS extraction in production mode

4. **Chrome Extension Permissions**:
   - `cookies` - Read and modify cookies
   - `storage` - Store settings and cache
   - `<all_urls>` - Access cookies from all domains
   - `tabs` - Get current tab information