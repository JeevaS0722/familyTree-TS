# FileMaster App

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following software installed before proceeding:

- **Node.js (>=20.0.0)**: FileMaster App requires Node.js version 20.0.0 or higher. Download and install it from [Node.js official website](https://nodejs.org/).

- **npm (>=10)**: npm is included with Node.js and is used to manage project dependencies. Verify your npm version:

  ```bash
  npm -v
  ```

- Update npm if necessary:
  `npm install -g npm@latest`

With Node.js and npm correctly installed and up to date, you're ready to set up the FileMaster API on your local development machine.

### Installation

- **Clone the Repository**

  ```bash
  git clone https://github.com/Coretopia/filemaster_app_v3.git
  cd filemaster_api_v3
  ```

- **Install Dependencies**

  `npm install`

### VS Code Extensions

To enhance the development experience and ensure consistency across development environments, this project includes an automatic VS Code extension installation feature as part of the `postinstall` script in `package.json`. Upon running `npm install`, the project will attempt to install several recommended VS Code extensions that are beneficial for working with this codebase.

The extensions include tools for linting (ESLint), code formatting (Prettier), TypeScript import management, better comments visualization, getter and setter generation, spell checking, and Jest integration for testing.

The script `installVscodeExtensions.ts`, executed after `npm install`, checks for the presence of the VS Code command-line interface (`code` or `code-insiders`) on your system. If detected, it proceeds to install the following extensions automatically:

- `dbaeumer.vscode-eslint` (ESLint integration)
- `esbenp.prettier-vscode` (Prettier integration)
- `pmneo.tsimporter` (TypeScript import management)
- `aaron-bond.better-comments` (Enhanced comments visualization)
- `DSKWRK.vscode-generate-getter-setter` (Getter and Setter generation)
- `streetsidesoftware.code-spell-checker` (Spell checker)

If the VS Code CLI is not detected, the script will log a warning message and skip the extension installation process. This feature aims to streamline the setup process for new developers and maintain a uniform development environment across different machines.

### Note:

This automatic installation process requires that the VS Code CLI is accessible from your system's command line. If you encounter issues or if the VS Code CLI is not installed, you can manually install the extensions from the VS Code Marketplace.

### Running the Application

**Start Development Server**

    `npm run dev`

The app should now be accessible at `http://localhost:8081/`

## Building for Production

To build an optimized version of the application for production, we use Webpack, which is a powerful tool that helps in bundling and optimizing the assets.

Run the following command to initiate the Webpack build process:

```bash
npm run build
```

Webpack will perform several tasks to prepare your app for production, including:

- Bundling minified versions.
- Optimizing and compressing image and font assets.
- Splitting the code into manageable chunks for faster browser loading.
- The dist directory will be created or updated with the production build files upon completion. These files are ready to be deployed in the server.

## Built With

- [React](https://www.npmjs.com/package/react/) - A JavaScript library for building user interfaces.
- [Material-UI](https://mui.com/material-ui/getting-started/installation/) - For UI components.
- [i18next](https://www.npmjs.com/package/i18next/) - For internationalization.
- [Webpack UI](https://webpack.js.org/guides/installation/) - For bundling and optimizing assets.
