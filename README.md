# SolHound Extension

Built using the WXT Framework, React, and TypeScript.

## Project Structure

```
.gitignore
package.json
README.md
tsconfig.json
wxt.config.ts
.output/
    edge-mv3/
        background.js
        highlighting.js
        manifest.json
        popup.html
        assets/
        chunks/
        content-scripts/
        icon/
.wxt/
    tsconfig.json
    wxt.d.ts
    types/
        globals.d.ts
        i18n.d.ts
        imports.d.ts
        paths.d.ts
src/
    assets/
    components/
        feature-toggle.tsx
        header.tsx
        login-status.tsx
        premium-feature.tsx
    data/
        const.ts
    entrypoints/
        content.ts
        highlight-styles.css
        ...
    hooks/
        ...
    public/
        icon/
    utils/
```

- **.output/**: Contains the build output files.
  - **edge-mv3/**: Contains files specific to the Edge browser extension.
    - **background.js**: Background script for the extension.
    - **highlighting.js**: Script for highlighting functionality.
    - **manifest.json**: Manifest file for the extension.
    - **popup.html**: HTML file for the extension's popup.
    - **assets/**: Contains asset files.
    - **chunks/**: Contains chunk files.
    - **content-scripts/**: Contains content scripts.
    - **icon/**: Contains icon files.

- **.wxt/**: Contains WXT framework configuration and type definitions.
  - **tsconfig.json**: TypeScript configuration for the WXT framework.
  - **wxt.d.ts**: Type definitions for the WXT framework.
  - **types/**: Contains additional type definitions.
    - **globals.d.ts**: Global type definitions.
    - **i18n.d.ts**: Internationalization type definitions.
    - **imports.d.ts**: Import type definitions.
    - **paths.d.ts**: Path type definitions.

- **src/**: Contains the source code of the project.
  - **assets/**: Contains asset files.
  - **components/**: Contains React components.
    - **feature-toggle.tsx**: Feature toggle component.
    - **header.tsx**: Header component.
    - **login-status.tsx**: Login status component.
    - **premium-feature.tsx**: Premium feature component.
  - **data/**: Contains data-related files.
    - **const.ts**: Constants file.
  - **entrypoints/**: Contains entry point files.
    - **content.ts**: Content script entry point.
    - **highlight-styles.css**: CSS styles for highlighting.
  - **hooks/**: Contains custom React hooks.
  - **public/**: Contains public files.
    - **icon/**: Contains icon files.
  - **utils/**: Contains utility functions.