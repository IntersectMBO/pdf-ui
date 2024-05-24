import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/context';

const ProposedGovernanceActions = () => {
    const { walletAPI } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (walletAPI) {
        }
    }, [walletAPI]);
    return (
        <div>
            ProposedGovernanceActions
            <Button
                variant='contained'
                sx={{ mt: 4 }}
                onClick={() => navigate('/en/proposed-governance-actions/1')}
            >
                Single
            </Button>
        </div>
    );
};

export default ProposedGovernanceActions;
