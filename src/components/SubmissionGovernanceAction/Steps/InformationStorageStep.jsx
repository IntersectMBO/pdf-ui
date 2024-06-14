'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/context';
import {
    CheckingDataModal,
    ExternalDataNotMatchModal,
    UrlErrorModal,
    CancelRegistrationModal,
    GovernanceActionSubmittedModal,
} from '../../../components/SubmissionGovernanceAction';
import { updateProposalContent } from '../../../lib/api';

const InformationStorageStep = ({ proposal, handleCloseSubmissionDialog }) => {
    const navigate = useNavigate();
    const { walletAPI } = useAppContext();
    const [jsonLdData, setJsonLdData] = useState({});
    const [hashData, setHashData] = useState('');
    const [fileURL, setFileURL] = useState('');

    const [showCheckingDataModal, setCheckingDataModal] = useState(false);
    const [showExternalDataNotMatchModal, setShowExternalDataNotMatchModal] =
        useState(false);
    const [showUrlErrorModal, setShowUrlErrorModal] = useState(false);
    const [showCancelRegistrationModal, setShowCancelRegistrationModal] =
        useState(false);
    const [
        showGovernanceActionSubmittedModal,
        setShowGovernanceActionSubmittedModal,
    ] = useState(false);

    const handleCreateGAJsonLD = async () => {
        const referencesList = [];

        if (
            proposal?.attributes?.content?.attributes?.proposal_links?.length >
            0
        ) {
            proposal?.attributes?.content?.attributes?.proposal_links?.map(
                (reference) => {
                    referencesList.push({
                        label: reference?.prop_link_text || 'Label',
                        uri: reference?.prop_link,
                    });
                }
            );
        }

        const jsonLd = await walletAPI.createGovernanceActionJsonLD({
            title: proposal?.attributes?.content?.attributes?.prop_name,
            abstract: proposal?.attributes?.content?.attributes?.prop_abstract,
            motivation:
                proposal?.attributes?.content?.attributes?.prop_motivation,
            rationale:
                proposal?.attributes?.content?.attributes?.prop_rationale,
            references: referencesList,
        });

        if (!jsonLd) return;
        setJsonLdData(jsonLd);
        const hash = await walletAPI.createHash(jsonLd);
        setHashData(hash);
    };

    const replaceApiWithMetadataValidation = (url) => {
        return url.replace('api', 'metadata-validation');
    };

    const METADATA_API = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL
            ? replaceApiWithMetadataValidation(process.env.NEXT_PUBLIC_BASE_URL)
            : replaceApiWithMetadataValidation(
                  'https://dev-sanchonet.govtool.byron.network/api'
              ),
        timeout: 30000,
    });

    const handleGASubmission = async () => {
        try {
            setCheckingDataModal(true);
            const response = await METADATA_API.post(`/validate`, {
                url: fileURL,
                hash: hashData,
            });

            if (response?.data?.valid) {
                let govActionBuilder = null;
                if (
                    proposal?.attributes?.content?.attributes?.gov_action_type
                        ?.attributes?.gov_action_type_name === 'Info'
                ) {
                    govActionBuilder =
                        await walletAPI.buildNewInfoGovernanceAction({
                            hash: hashData,
                            url: fileURL,
                        });
                } else if (
                    proposal?.attributes?.content?.attributes?.gov_action_type
                        ?.attributes?.gov_action_type_name === 'Treasury'
                ) {
                    govActionBuilder =
                        await walletAPI.buildTreasuryGovernanceAction({
                            hash: hashData,
                            url: fileURL,
                            amount: proposal?.attributes?.content?.attributes
                                ?.prop_amount,
                            receivingAddress:
                                proposal?.attributes?.content?.attributes
                                    ?.prop_receiving_address,
                        });
                }

                if (govActionBuilder) {
                    const tx = await walletAPI.buildSignSubmitConwayCertTx({
                        govActionBuilder: govActionBuilder,
                        type: 'createGovAction',
                    });

                    if (tx) {
                        await updateProposalContent(
                            proposal?.attributes?.content?.id,
                            {
                                prop_submitted: true,
                                prop_submission_date: new Date(),
                                prop_submission_tx_hash: tx,
                            }
                        );
                        setShowGovernanceActionSubmittedModal(true);
                    }
                }
            } else {
                console.error(response);
                if (response?.data?.status === 'URL_NOT_FOUND') {
                    setShowUrlErrorModal(true);
                } else {
                    setShowExternalDataNotMatchModal(true);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCheckingDataModal(false);
        }
    };

    const handleDownloadJsonLD = () => {
        const blob = new Blob([JSON.stringify(jsonLdData, null, 2)], {
            type: 'application/ld+json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.jsonld';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (proposal && walletAPI) {
            handleCreateGAJsonLD();
        }
    }, [walletAPI, proposal]);

    return (
        <Box display='flex' flexDirection='column'>
            <Box>
                <Card variant='outlined'>
                    <CardContent
                        sx={{
                            ml: {
                                xs: 0,
                                sm: 5,
                                md: 5,
                                lg: 15,
                            },
                            mr: {
                                xs: 0,
                                sm: 5,
                                md: 5,
                                lg: 15,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                mt: 2,
                            }}
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                        >
                            <Typography
                                variant='h4'
                                component={'h2'}
                                gutterBottom
                            >
                                Information Storage Steps
                            </Typography>

                            <Button variant='text' size='small'>
                                Read full guide
                            </Button>

                            <Typography variant='body1' gutterBottom>
                                Download your file, save it to your chosen
                                location, and enter the URL of that location in
                                step 3
                            </Typography>

                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                sx={{
                                    width: '100%',
                                }}
                                my={2}
                            >
                                <Typography variant='body1' gutterBottom>
                                    1. Download this file
                                </Typography>

                                <Button
                                    variant='outlined'
                                    sx={{ ml: 2 }}
                                    onClick={() => handleDownloadJsonLD()}
                                >
                                    data.jsonld
                                </Button>
                            </Box>

                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                sx={{
                                    width: '100%',
                                }}
                                mb={2}
                            >
                                <Typography variant='body1' gutterBottom>
                                    1. Save this file in a location that
                                    provides a public URL (ex. github)
                                </Typography>
                            </Box>

                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Typography variant='body1' gutterBottom>
                                    3. Paste the URL here
                                </Typography>
                                <TextField
                                    fullWidth
                                    margin='normal'
                                    label='URL'
                                    variant='outlined'
                                    placeholder='URL'
                                    value={fileURL || ''}
                                    onChange={(e) => setFileURL(e.target.value)}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 4,
                            }}
                        >
                            <Button
                                variant='outlined'
                                sx={{ float: 'left' }}
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                onClick={handleGASubmission}
                                disabled={!fileURL}
                            >
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <CheckingDataModal open={showCheckingDataModal} />
            <ExternalDataNotMatchModal
                open={showExternalDataNotMatchModal}
                onClose={() => setShowExternalDataNotMatchModal(false)}
                buttonOneClick={handleCloseSubmissionDialog}
                buttonTwoClick={() => {
                    setShowExternalDataNotMatchModal(false);
                    setShowCancelRegistrationModal(true);
                }}
            />
            <UrlErrorModal
                open={showUrlErrorModal}
                onClose={() => setShowUrlErrorModal(false)}
                buttonOneClick={handleCloseSubmissionDialog}
                buttonTwoClick={() => {
                    setShowUrlErrorModal(false);
                    setShowCancelRegistrationModal(true);
                }}
            />

            <CancelRegistrationModal
                open={showCancelRegistrationModal}
                onClose={() => setShowCancelRegistrationModal(false)}
            />

            <GovernanceActionSubmittedModal
                open={showGovernanceActionSubmittedModal}
                onClose={() => setShowGovernanceActionSubmittedModal(false)}
            />
        </Box>
    );
};

export default InformationStorageStep;
