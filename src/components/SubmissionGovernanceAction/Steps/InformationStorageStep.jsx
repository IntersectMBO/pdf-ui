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

const InformationStorageStep = ({ proposal }) => {
    const navigate = useNavigate();
    const { walletAPI } = useAppContext();
    const [jsonLdData, setJsonLdData] = useState({});
    const [hashData, setHashData] = useState('');
    const [fileURL, setFileURL] = useState('');

    const handleCreateGAJsonLD = async () => {
        const jsonLd = await walletAPI.createGovernanceActionJsonLD({
            title: proposal?.attributes?.content?.attributes?.prop_name,
            abstract: proposal?.attributes?.content?.attributes?.prop_abstract,
            motivation:
                proposal?.attributes?.content?.attributes?.prop_motivation,
            rationale:
                proposal?.attributes?.content?.attributes?.prop_rationale,
        });

        if (!jsonLd) return;
        setJsonLdData(jsonLd);
        const hash = await walletAPI.createHash(jsonLd);
        setHashData(hash);
    };

    const METADATA_API = axios.create({
        baseURL:
            'https://dev-sanchonet.govtool.byron.network/metadata-validation',
        timeout: 30000,
    });

    const handleValidation = async () => {
        const response = await METADATA_API.post(`/validate`, {
            url: fileURL,
            hash: hashData,
        });
        if (response?.data?.valid) {
            const govActionBuilder =
                await walletAPI.buildNewInfoGovernanceAction({
                    hash: hashData,
                    url: fileURL,
                });

            if (govActionBuilder) {
                const tx = await walletAPI.buildSignSubmitConwayCertTx({
                    govActionBuilder: govActionBuilder,
                    type: 'createGovAction',
                });

                //console.log(tx);
            }
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
                                    [file_name].jsonld
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
                                onClick={handleValidation}
                            >
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default InformationStorageStep;
