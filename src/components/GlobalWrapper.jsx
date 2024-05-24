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

    const loginUserToApp = async (wallet) => {
        try {
            clearSession();
            setWalletAPI(null);
            setUser(null);

            const rawWalletAddress = await wallet?.getChangeAddress();

            const userResponse = await loginUser({
                identifier: rawWalletAddress,
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
            loginUserToApp(GovToolAssemblyWalletAPI);
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
            <RoutesWrapper locale={GovToolAssemblyLocale} />
        </Box>
    );
};

export default GlobalWrapper;
