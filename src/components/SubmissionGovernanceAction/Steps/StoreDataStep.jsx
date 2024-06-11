'use client';

import React, { useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StoreDataStep = ({ setStep }) => {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

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
                                Store and Maintain the Data Yourself
                            </Typography>

                            <Button variant='text' sx={{ mt: 2 }}>
                                Learn more about storing information
                            </Button>

                            <FormControlLabel
                                id='registration-label1'
                                sx={{
                                    mt: 2,
                                    alignItems: 'flex-start',
                                }}
                                control={
                                    <Checkbox
                                        id='submission-checkbox'
                                        name='agreeTerms'
                                        color='primary'
                                        sx={{
                                            pt: 0,
                                        }}
                                        onChange={(e) =>
                                            setChecked((prev) => !prev)
                                        }
                                    />
                                }
                                label={
                                    <Typography variant='caption'>
                                        I agree to store correctly this
                                        information and to maintain them over
                                        the years
                                    </Typography>
                                }
                            />
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
                                onClick={() => setStep(2)}
                                disabled={!checked}
                            >
                                Continue
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                :
            </Box>
        </Box>
    );
};

export default StoreDataStep;
