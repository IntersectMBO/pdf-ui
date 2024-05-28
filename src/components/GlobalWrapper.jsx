'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { RoutesWrapper } from '.';
import { useAppContext } from '../context/context';
import { loginUser } from '../lib/api';
import { clearSession, saveDataInSession } from '../lib/utils';

const GlobalWrapper = ({ ...props }) => {
    const { walletAPI, setWalletAPI, setLocale, setUser, user } =
        useAppContext();
    const [mounted, setMounted] = useState(false);

    const {
        walletAPI: GovToolAssemblyWalletAPI,
        locale: GovToolAssemblyLocale,
    } = props;

    const loginUserToApp = async (wallet) => {
        try {
            clearSession();
            setWalletAPI(null);
            setUser(null);

            let walletAddress = await wallet?.getChangeAddress();
            const userResponse = await loginUser({
                identifier: walletAddress,
            });

            saveDataInSession('pdfUserJwt', userResponse?.jwt);
            setUser(userResponse);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            if (GovToolAssemblyWalletAPI?.getChangeAddress) {
                setWalletAPI(GovToolAssemblyWalletAPI);
                loginUserToApp(GovToolAssemblyWalletAPI);
            } else {
                clearSession();
                setWalletAPI(null);
                setUser(null);
            }
        }
    }, [GovToolAssemblyWalletAPI, walletAPI, mounted]);

    useEffect(() => {
        if (GovToolAssemblyLocale) {
            setLocale(GovToolAssemblyLocale);
        }
    }, [GovToolAssemblyLocale]);

    return (
        <Box
            component='section'
            display={'flex'}
            flexDirection={'column'}
            flexGrow={1}
        >
            <RoutesWrapper />
        </Box>
    );
};

export default GlobalWrapper;
