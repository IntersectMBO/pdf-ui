'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { UsernameModal } from '../components';
import { useAppContext } from '../context/context';
import { loginUser } from '../lib/api';
import { clearSession, saveDataInSession } from '../lib/utils';
import {
    CreateGovernanceAction,
    ProposedGovernanceActions,
    SingleGovernanceAction,
} from '../pages';

const GlobalWrapper = ({ ...props }) => {
    const pathname = props?.pathname;
    const { setWalletAPI, setLocale, setUser } = useAppContext();
    const [mounted, setMounted] = useState(false);
    const [openUsernameModal, setOpenUsernameModal] = useState(false);

    const {
        walletAPI: GovToolAssemblyWalletAPI,
        locale: GovToolAssemblyLocale,
    } = props;

    const clearStates = () => {
        clearSession();
        setWalletAPI(null);
        setUser(null);
    };

    const loginUserToApp = async (wallet) => {
        try {
            const userResponse = await loginUser({
                identifier: wallet.address,
            });

            saveDataInSession('pdfUserJwt', userResponse?.jwt);
            setUser(userResponse);

            if (!userResponse?.user?.govtool_username) {
                setOpenUsernameModal(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    function getProposalID(url) {
        const parts = url.split('/');
        const lastSegment = parts[parts.length - 1];

        if (isNaN(lastSegment) || lastSegment.trim() === '') {
            return null;
        }

        return lastSegment;
    }

    useEffect(() => {
        if (!mounted) {
            clearStates();
            setMounted(true);
        } else {
            if (GovToolAssemblyWalletAPI?.address) {
                setWalletAPI(GovToolAssemblyWalletAPI);
                loginUserToApp(GovToolAssemblyWalletAPI);
            } else {
                clearStates();
            }
        }
    }, [GovToolAssemblyWalletAPI?.address, mounted]);

    useEffect(() => {
        if (GovToolAssemblyLocale) {
            setLocale(GovToolAssemblyLocale);
        }
    }, [GovToolAssemblyLocale]);

    const renderComponentBasedOnPath = (path) => {
        if (
            path.includes('create-governance-action') &&
            GovToolAssemblyWalletAPI?.getChangeAddress
        ) {
            return <CreateGovernanceAction />;
        } else if (
            path.includes('proposal_discussion/') &&
            getProposalID(path)
        ) {
            return <SingleGovernanceAction id={getProposalID(path)} />;
        } else if (path.includes('proposal_discussion')) {
            return <ProposedGovernanceActions />;
        } else {
            return <ProposedGovernanceActions />;
        }
    };

    return (
        <Box
            component='section'
            display={'flex'}
            flexDirection={'column'}
            flexGrow={1}
        >
            {renderComponentBasedOnPath(pathname)}
            <UsernameModal
                open={openUsernameModal}
                handleClose={() => setOpenUsernameModal(false)}
            />
        </Box>
    );
};

export default GlobalWrapper;
