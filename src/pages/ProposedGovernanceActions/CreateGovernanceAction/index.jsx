import { useTheme } from '@emotion/react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Button, Grid, useMediaQuery } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Step1,
    Step2,
    Step3,
} from '../../../components/CreationGoveranceAction';
import { useAppContext } from '../../../context/context';
import { createProposal } from '../../../lib/api';

const CreateGovernanceAction = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { user, setLoading, locale } = useAppContext();
    const [step, setStep] = useState(1);
    const [proposalData, setProposalData] = useState({
        proposal_links: [],
    });

    const [governanceActionTypes, setGovernanceActionTypes] = useState([]);
    const [isContinueDisabled, setIsContinueDisabled] = useState(true);

    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('sm')
    );

    // Define handleIsContinueDisabled using useCallback
    const handleIsContinueDisabled = useCallback(() => {
        if (
            proposalData?.gov_action_type_id &&
            proposalData?.prop_name &&
            proposalData?.prop_abstract &&
            proposalData?.prop_motivation &&
            proposalData?.prop_rationale &&
            proposalData?.prop_receiving_address &&
            proposalData?.prop_amount
        ) {
            setIsContinueDisabled(false);
        } else {
            setIsContinueDisabled(true);
        }
    }, [proposalData]); // proposalData is a dependency

    // Use handleIsContinueDisabled in useEffect
    useEffect(() => {
        handleIsContinueDisabled();
    }, [handleIsContinueDisabled]); // Now handleIsContinueDisabled can be safely added to the dependency array

    const handleSaveDraft = async (addPoll = false, shouldNavigate = false) => {
        setLoading(true);
        try {
            if (
                !(
                    proposalData?.proposal_id &&
                    proposalData?.proposal_content_id
                )
            ) {
                const { data } = await createProposal(proposalData, addPoll);

                if (
                    shouldNavigate &&
                    data &&
                    data?.attributes &&
                    data?.attributes?.proposal_id
                ) {
                    navigate(
                        `/proposal_discussion/${data?.attributes?.proposal_id}`
                    );
                }

                return data?.attributes?.proposal_id;
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setProposalData((prev) => ({
            ...prev,
            user_id: user?.user?.id,
        }));
    }, [user]);

    return (
        <>
            <Grid item mt={2} mb={2}>
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
            </Grid>
            <Grid
                xs={12}
                item
                display='flex'
                justifyContent='center'
                alignContent='center'
            >
                <Grid xs={11} md={5} item zIndex={1} maxWidth='940px'>
                    {step === 1 && (
                        <Step1
                            setStep={setStep}
                            isContinueDisabled={isContinueDisabled}
                            setProposalData={setProposalData}
                            handleSaveDraft={handleSaveDraft}
                        />
                    )}

                    {step === 2 && (
                        <Step2
                            setStep={setStep}
                            proposalData={proposalData}
                            setProposalData={setProposalData}
                            handleSaveDraft={handleSaveDraft}
                            governanceActionTypes={governanceActionTypes}
                            setGovernanceActionTypes={setGovernanceActionTypes}
                            isSmallScreen={isSmallScreen}
                            isContinueDisabled={isContinueDisabled}
                        />
                    )}

                    {step === 3 && (
                        <Step3
                            setStep={setStep}
                            proposalData={proposalData}
                            governanceActionTypes={governanceActionTypes}
                            isSmallScreen={isSmallScreen}
                            handleSaveDraft={handleSaveDraft}
                        />
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default CreateGovernanceAction;
