'use client';

import { Box } from '@mui/material';
import { useEffect } from 'react';
import { RoutesWrapper } from '.';
import { useAppContext } from '../context/context';
import { loginUser } from '../lib/api';
import { clearSession, saveDataInSession } from '../lib/utils';

const GlobalWrapper = ({ ...props }) => {
    const { walletAPI, setWalletAPI, setLocale, setUser } = useAppContext();
    const {
        walletAPI: GovToolAssemblyWalletAPI,
        locale: GovToolAssemblyLocale,
    } = props;

    const loginUserToApp = async (walletAddress) => {
        try {
            clearSession();
            setWalletAPI(null);
            setUser(null);

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
        if (GovToolAssemblyWalletAPI) {
            setWalletAPI(GovToolAssemblyWalletAPI);
            loginUserToApp(GovToolAssemblyWalletAPI?.address);
        } else {
            clearSession();
            setWalletAPI(null);
            setUser(null);
        }
    }, [GovToolAssemblyWalletAPI, walletAPI]);

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
