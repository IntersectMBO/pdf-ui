'use client';

import { useTheme } from '@emotion/react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    StoreDataStep,
    InformationStorageStep,
} from '../../../components/SubmissionGovernanceAction';

const SubmissionGovernanceAction = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [step, setStep] = useState(1);

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
                <Grid
                    xs={11}
                    md={5}
                    item
                    zIndex={1}
                    maxWidth='910px'
                    width='100%'
                >
                    {step === 1 && <StoreDataStep setStep={setStep} />}
                    {step === 2 && <InformationStorageStep setStep={setStep} />}
                </Grid>
            </Grid>
        </>
    );
};

export default SubmissionGovernanceAction;
