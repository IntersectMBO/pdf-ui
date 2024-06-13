'use client';

import { useState } from 'react';
import { Box, Dialog, Button, Typography } from '@mui/material';
import {
    StoreDataStep,
    InformationStorageStep,
} from '../../components/SubmissionGovernanceAction';
import { useNavigate } from 'react-router-dom';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';
const ProposalSubmissionDialog = ({
    proposal,
    openEditDialog,
    handleCloseSubmissionDialog,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    return (
        <Box>
            <Dialog
                fullScreen
                open={openEditDialog}
                onClose={handleCloseSubmissionDialog}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        overflow: 'auto',
                        minHeight: 0,
                    }}
                >
                    <Box
                        sx={{
                            borderBottom: `1px solid ${theme.palette.border.gray}`,
                            pl: 4,
                            mt: 2,
                        }}
                    >
                        <Typography variant='h4' component='h1' gutterBottom>
                            Create a Governance Action
                        </Typography>
                    </Box>
                    <Box m={2}>
                        <Button
                            size='small'
                            startIcon={
                                <IconCheveronLeft
                                    width='18'
                                    height='18'
                                    fill={theme.palette.primary.main}
                                />
                            }
                            onClick={() => navigate(`/proposal_discussion`)}
                        >
                            Show all
                        </Button>
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {step === 1 && <StoreDataStep setStep={setStep} />}
                        {step === 2 && (
                            <InformationStorageStep
                                proposal={proposal}
                                handleCloseSubmissionDialog={
                                    handleCloseSubmissionDialog
                                }
                            />
                        )}
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export default ProposalSubmissionDialog;
