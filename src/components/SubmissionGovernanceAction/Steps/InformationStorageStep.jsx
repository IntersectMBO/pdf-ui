'use client';

import React, { useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InformationStorageStep = () => {
    const navigate = useNavigate();

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

                                <Button variant='outlined' sx={{ ml: 2 }}>
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
                                alignItems={'center'}
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Typography variant='body1' gutterBottom>
                                    3. Paste the URL here
                                    <TextField
                                        fullWidth
                                        margin='normal'
                                        label='URL'
                                        variant='outlined'
                                        placeholder='URL'
                                    />
                                </Typography>
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
                            <Button variant='contained'>Submit</Button>
                        </Box>
                    </CardContent>
                </Card>
                :
            </Box>
        </Box>
    );
};

export default InformationStorageStep;
