import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LinkManager } from '.';
import { useAppContext } from '../../context/context';
import { getGovernanceActionTypes } from '../../lib/api';
const Step2 = ({
    setStep,
    proposalData,
    setProposalData,
    handleSaveDraft,
    governanceActionTypes,
    setGovernanceActionTypes,
    isSmallScreen,
    isContinueDisabled,
}) => {
    const maxLength = 256;
    const { setLoading } = useAppContext();
    const [selectedGovActionName, setSelectedGovActionName] = useState('');

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const selectedLabel = governanceActionTypes.find(
            (option) => option?.value === selectedValue
        )?.label;

        setProposalData((prev) => ({
            ...prev,
            gov_action_type_id: selectedValue,
            prop_receiving_address: null,
            prop_amount: null,
        }));

        setSelectedGovActionName(selectedLabel);
    };

    const fetchGovernanceActionTypes = async () => {
        setLoading(true);
        try {
            const governanceActionTypeList = await getGovernanceActionTypes();

            const mappedData = governanceActionTypeList?.data?.map((item) => ({
                value: item?.id,
                label: item?.attributes?.gov_action_type_name,
            }));

            setGovernanceActionTypes(mappedData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGovernanceActionTypes();
    }, []);

    return (
        <Card>
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
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            align: 'center',
                            textAlign: 'center',
                            mt: 2,
                        }}
                    >
                        <Typography
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.orange}
                            gutterBottom
                        >
                            REQUIRED
                        </Typography>

                        <Typography variant='h4' gutterBottom>
                            Proposal Details
                        </Typography>

                        <Typography
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.grey}
                            gutterBottom
                        >
                            Subtext to describe something if needed
                        </Typography>
                    </Box>

                    <TextField
                        select
                        label='Governance Action Type'
                        value={proposalData?.gov_action_type_id || ''}
                        required
                        fullWidth
                        onChange={handleChange}
                        data-testid='governance-action-type'
                    >
                        {governanceActionTypes?.map((option, index) => (
                            <MenuItem
                                key={option?.value}
                                value={option?.value}
                                data-testid={`${option?.label?.toLowerCase()}-button`}
                            >
                                {option?.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label='Title'
                        variant='outlined'
                        value={proposalData?.prop_name || ''}
                        fullWidth
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_name: e.target.value,
                            }))
                        }
                        required
                        data-testid='title-input'
                    />

                    <TextField
                        size='large'
                        name='Abstract'
                        label='Abstract'
                        placeholder='Summary...'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_abstract || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_abstract: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant='caption'>
                                    * General Summary of your proposal
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{ float: 'right' }}
                                >
                                    {`${
                                        proposalData?.prop_abstract?.length || 0
                                    }/${maxLength}`}
                                </Typography>
                            </>
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: maxLength,
                            },
                        }}
                        data-testid='abstract-input'
                    />

                    <TextField
                        size='large'
                        name='Motivation'
                        label='Motivation'
                        placeholder='Problem this will solve'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_motivation || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_motivation: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant='caption'>
                                    * How will this solve a problem
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{ float: 'right' }}
                                >
                                    {`${
                                        proposalData?.prop_motivation?.length ||
                                        0
                                    }/${maxLength}`}
                                </Typography>
                            </>
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: maxLength,
                            },
                        }}
                        data-testid='motivation-input'
                    />

                    <TextField
                        size='large'
                        name='Rationale'
                        label='Rationale'
                        placeholder='Problem this will solve'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_rationale || ''}
                        onChange={(e) =>
                            setProposalData((prev) => ({
                                ...prev,
                                prop_rationale: e.target.value,
                            }))
                        }
                        required
                        helperText={
                            <>
                                <Typography variant='caption'>
                                    * Put all the content of the Proposal here
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{ float: 'right' }}
                                >
                                    {`${
                                        proposalData?.prop_rationale?.length ||
                                        0
                                    }/${maxLength}`}
                                </Typography>
                            </>
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: maxLength,
                            },
                        }}
                        data-testid='rationale-input'
                    />

                    {selectedGovActionName === 'Treasury' ? (
                        <>
                            <TextField
                                margin='normal'
                                label='Receiving address'
                                variant='outlined'
                                value={
                                    proposalData?.prop_receiving_address || ''
                                }
                                fullWidth
                                onChange={(e) =>
                                    setProposalData((prev) => ({
                                        ...prev,
                                        prop_receiving_address: e.target.value,
                                    }))
                                }
                                required
                                data-testid='receiving-address-input'
                            />

                            <TextField
                                margin='normal'
                                label='Amount'
                                type='number'
                                variant='outlined'
                                placeholder='e.g. 2000'
                                value={proposalData?.prop_amount || ''}
                                fullWidth
                                onChange={(e) =>
                                    setProposalData((prev) => ({
                                        ...prev,
                                        prop_amount: e.target.value,
                                    }))
                                }
                                required
                                data-testid='amount-input'
                            />
                        </>
                    ) : null}

                    <Box
                        sx={{
                            align: 'center',
                            textAlign: 'center',
                            mt: 2,
                        }}
                    >
                        <Typography
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.orange}
                            gutterBottom
                        >
                            OPTIONAL
                        </Typography>

                        <Typography variant='h5' gutterBottom>
                            References and Supporting Information
                        </Typography>

                        <Typography
                            variant='subtitle2'
                            color={(theme) => theme.palette.text.grey}
                            gutterBottom
                        >
                            Links to extra content or social media contacts
                            (maiximum of 7 entries)
                        </Typography>
                    </Box>

                    <LinkManager
                        proposalData={proposalData}
                        setProposalData={setProposalData}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        justifyContent: 'space-between',
                        mt: 10,
                    }}
                >
                    <Box>
                        <Button
                            variant='outlined'
                            sx={{
                                mb: {
                                    xs: 2,
                                    md: 0,
                                },
                            }}
                            fullWidth={isSmallScreen}
                            onClick={() => setStep(1)}
                            data-testid='back-button'
                        >
                            Back
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                whiteSpace: 'nowrap',
                                textTransform: 'none',
                                width: '100%',
                            }}
                        >
                            <Button
                                variant='text'
                                fullWidth
                                disabled={isContinueDisabled}
                                onClick={() => {
                                    handleSaveDraft(true);
                                }}
                                data-testid='save-draft-button'
                            >
                                Save Draft
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                disabled={isContinueDisabled}
                                onClick={() => setStep(3)}
                                data-testid='continue-button'
                            >
                                Continue
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Step2;
