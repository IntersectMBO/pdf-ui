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
    SubmissionGovernanceAction,
} from '../pages';
import { format } from 'date-fns';

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

    function utf8ToHex(str) {
        return Array.from(str)
            .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
    }

    const loginUserToApp = async (wallet) => {
        try {
            const changeAddrHex = await wallet.getChangeAddress();
            const messageUtf = `Please sign this message to verify your identity at ${format(new Date(), 'd MMMM yyyy HH:mm:ss')}`;
            const messageHex = utf8ToHex(messageUtf);
            const signedData = await wallet.signData(changeAddrHex, messageHex);

            const userResponse = await loginUser({
                identifier: changeAddrHex,
                signedData,
            });

            if (!userResponse) return;
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
            path.includes('submit-governance-action') &&
            GovToolAssemblyWalletAPI?.getChangeAddress
        ) {
            return <SubmissionGovernanceAction />;
        } else if (
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
