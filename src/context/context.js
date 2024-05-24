import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [walletAPI, setWalletAPI] = useState(null);
    const [locale, setLocale] = useState('en');

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                walletAPI,
                setWalletAPI,
                locale,
                setLocale,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error(
            'useAppContext must be used within a AppContextProvider'
        );
    }

    return context;
}
