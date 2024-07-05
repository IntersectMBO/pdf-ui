import { useTheme } from '@emotion/react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Button,
    Grid,
    Dialog,
    Typography,
    Box,
    useMediaQuery,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Step1,
    Step2,
    Step3,
    DraftSuccessfulModal,
} from '../CreationGoveranceAction';
import { useAppContext } from '../../context/context';
import { createProposal, deleteProposal } from '../../lib/api';
import CreateGA2 from '../../assets/svg/CreateGA2.js';

const CreateGovernanceActionDialog = ({ open = false, onClose = false }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { user, setLoading } = useAppContext();
    const [step, setStep] = useState(1);
    const [proposalData, setProposalData] = useState({
        proposal_links: [],
    });

    const [governanceActionTypes, setGovernanceActionTypes] = useState([]);
    const [isContinueDisabled, setIsContinueDisabled] = useState(true);
    const [showDraftSuccessfulModal, setShowDraftSuccessfulModal] =
        useState(false);
    const [selectedDraftId, setSelectedDraftId] = useState(null);

    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('sm')
    );

    const handleDeleteProposal = async () => {
        setLoading(true);
        try {
            await deleteProposal(selectedDraftId);
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    // Define handleIsContinueDisabled using useCallback
    const handleIsContinueDisabled = useCallback(() => {
        if (
            proposalData?.gov_action_type_id &&
            proposalData?.prop_name &&
            proposalData?.prop_abstract &&
            proposalData?.prop_motivation &&
            proposalData?.prop_rationale
        ) {
            const selectedLabel = governanceActionTypes.find(
                (option) => option?.value === proposalData?.gov_action_type_id
            )?.label;

            if (selectedLabel === 'Treasury') {
                if (
                    proposalData?.prop_receiving_address &&
                    proposalData?.prop_amount
                ) {
                    setIsContinueDisabled(false);
                } else {
                    setIsContinueDisabled(true);
                }
            } else {
                setIsContinueDisabled(false);
            }
        } else {
            setIsContinueDisabled(true);
        }
    }, [proposalData]); // proposalData is a dependency

    const handleCreateProposal = async (isDraft = false) => {
        setLoading(true);
        try {
            if (
                !(
                    proposalData?.proposal_id &&
                    proposalData?.proposal_content_id
                )
            ) {
                const { data } = await createProposal({
                    ...proposalData,
                    is_draft: isDraft,
                });
                if (data && data?.attributes && data?.attributes?.proposal_id) {
                    if (isDraft) {
                        setShowDraftSuccessfulModal(true);
                    } else {
                        navigate(
                            `/proposal_discussion/${data?.attributes?.proposal_id}`
                        );
                    }

                    if (selectedDraftId) {
                        handleDeleteProposal();
                    }
                }

                return data?.attributes?.proposal_id;
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Use handleIsContinueDisabled in useEffect
    useEffect(() => {
        handleIsContinueDisabled();
    }, [handleIsContinueDisabled]); // Now handleIsContinueDisabled can be safely added to the dependency array

    useEffect(() => {
        setProposalData((prev) => ({
            ...prev,
        }));
    }, [user]);

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            data-testid='create-governance-action-dialog'
        >
            <Box
                sx={{
                    position: 'relative',
                    height: '100%',
                }}
            >
                <Grid container pb={4}>
                    <Grid
                        item
                        sx={{
                            borderBottom: `1px solid ${theme.palette.border.gray}`,
                            pl: 4,
                            mt: 2,
                        }}
                        xs={12}
                    >
                        <Typography variant='h4' component='h1' gutterBottom>
                            Propose a Governance Action
                        </Typography>
                    </Grid>
                    <Grid item my={2} pl={4} xs={12} zIndex={10}>
                        <Button
                            size='small'
                            startIcon={
                                <IconCheveronLeft
                                    width='18'
                                    height='18'
                                    fill={theme.palette.primary.main}
                                />
                            }
                            onClick={onClose}
                            data-testid='show-all-button'
                        >
                            Show all
                        </Button>
                    </Grid>
                    <Grid
                        xs={12}
                        item
                        display='flex'
                        justifyContent='center'
                        alignContent='center'
                        pt={4}
                    >
                        <Grid xs={11} md={8} item zIndex={10}>
                            {step === 1 && (
                                <Step1
                                    setStep={setStep}
                                    setProposalData={setProposalData}
                                    onClose={onClose}
                                    setSelectedDraftId={setSelectedDraftId}
                                />
                            )}

                            {step === 2 && (
                                <Step2
                                    setStep={setStep}
                                    proposalData={proposalData}
                                    setProposalData={setProposalData}
                                    handleSaveDraft={handleCreateProposal}
                                    governanceActionTypes={
                                        governanceActionTypes
                                    }
                                    setGovernanceActionTypes={
                                        setGovernanceActionTypes
                                    }
                                    isSmallScreen={isSmallScreen}
                                    isContinueDisabled={isContinueDisabled}
                                    selectedDraftId={selectedDraftId}
                                />
                            )}

                            {step === 3 && (
                                <Step3
                                    setStep={setStep}
                                    proposalData={proposalData}
                                    governanceActionTypes={
                                        governanceActionTypes
                                    }
                                    isSmallScreen={isSmallScreen}
                                    handleSaveDraft={handleCreateProposal}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                >
                    <CreateGA2 />
                </Box>
            </Box>

            <DraftSuccessfulModal
                open={showDraftSuccessfulModal}
                onClose={() => setShowDraftSuccessfulModal(false)}
                closeCreateGADialog={onClose}
            />
        </Dialog>
    );
};

export default CreateGovernanceActionDialog;
