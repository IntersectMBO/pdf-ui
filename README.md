# @intersect.mbo/pdf-ui

The `@intersect.mbo/pdf-ui` is a React.js package that includes all the necessary logic and UI components required for the operation of a proposal discussion forum.

## Table of content:

-   [Installation](#installation)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Running locally](#running-locally)

## Installation

To install this pacakge, use npm or yarn:

### `npm install @intersect.mbo/pdf-ui`

or

### `yarn add @intersect.mbo/pdf-ui`

## Usage

After installation, you can import the component and use it in your project. This is an example of implementing a package in a [NextJs](https://nextjs.org/) application:

```jsx
'use client';
import dynamic from 'next/dynamic';
import { useWalletContext } from '@/context/walletProvider';
import { localePrefix, defaultLocale } from '@/constants';
import { usePathname } from 'next/navigation';

const ProposalDiscussion = dynamic(() => import('@intersect.mbo/pdf-ui'), {
    ssr: false,
});

export default function Page({ params: { locale } }) {
    const pathname = usePathname();
    const {
        disableWallet,
        enableError,
        enableWallet,
        isEnableLoading,
        walletAPI,
        address,
        network,
    } = useWalletContext();

    return (
        <ProposalDiscussion
            locale={locale}
            localePrefix={localePrefix}
            defaultLocale={defaultLocale}
            pathname={pathname}
            walletAPI={{
                disableWallet,
                enableError,
                enableWallet,
                isEnableLoading,
                address,
                network,
                ...walletAPI,
            }}
        />
    );
}
```

## Project Structure

```pdf-ui
├── node_modules
├── src
│   ├── components
│   ├── context
│   ├── lib
│   ├── pages
│   ├── styles
│   └── App.jsx
│   └── index.js
└── rollup.config.js
```

-   **components/**: The `@intersect.mbo/pdf-ui` components.
-   **context/**: Context for global application state.
-   **lib/**: Libraries and helper functions.
-   **pages/**: Application pages.
-   **styles/**: SCSS files for styling the application.
-   **index.js**: Main application file.
-   **rollup.config.js**: Configuration for the Rollup bundler.

## Prerequisites

Before starting, please ensure you have the following:

-   Node.js and npm - Latest versions. You can download them from [here](https://nodejs.org/en/download/).

## Running locally

To launch the package, it is necessary to have an application (for example, a Next.js app) into which this package is imported. This wrapper application must provide wallet connectivity to supply the wallet API to the package.

In the wrapper application, you need to add the `NEXT_PUBLIC_PROPOSAL_DISCUSSION_API_URL` environment variable to the .env file, with the URL of the proposal discussion backend.
