import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [walletAPI, setWalletAPI] = useState(null);
    const [validateMetadata, setValidateMetadata] = useState(null);
    const [locale, setLocale] = useState('en');
    const [openUsernameModal, setOpenUsernameModal] = useState({
        open: false,
        callBackFn: () => {},
    });

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
                openUsernameModal,
                setOpenUsernameModal,
                validateMetadata,
                setValidateMetadata,
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
