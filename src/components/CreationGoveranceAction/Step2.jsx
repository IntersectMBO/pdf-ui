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
import {
    containsString,
    isRewardAddress,
    maxLengthCheck,
    numberValidation,
} from '../../lib/utils';
const Step2 = ({
    setStep,
    proposalData,
    setProposalData,
    handleSaveDraft,
    governanceActionTypes,
    setGovernanceActionTypes,
    isSmallScreen,
    isContinueDisabled,
    errors,
    setErrors,
    helperText,
    setHelperText,
    linksErrors,
    setLinksErrors,
}) => {
    const titleMaxLength = 80;
    const abstractMaxLength = 2500;
    const motivationRationaleMaxLength = 12000;
    const { setLoading } = useAppContext();
    const [selectedGovActionName, setSelectedGovActionName] = useState(
        governanceActionTypes.find(
            (option) => option?.value === proposalData?.gov_action_type_id
        )?.label || ''
    );

    const handleAddressChange = async (e) => {
        const newAddress = e.target.value?.trim();
        setProposalData((prev) => ({
            ...prev,
            prop_receiving_address: newAddress,
        }));

        if (newAddress === '') {
            setErrors((prev) => ({
                ...prev,
                address: false,
            }));
            setHelperText((prev) => ({
                ...prev,
                address: ``,
            }));
            return;
        }

        const validationResult = await isRewardAddress(newAddress);
        if (validationResult === true) {
            setErrors((prev) => ({
                ...prev,
                address: false,
            }));
            setHelperText((prev) => ({
                ...prev,
                address: ``,
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                address: true,
            }));
            setHelperText((prev) => ({
                ...prev,
                address: validationResult,
            }));
        }
    };

    const handleAmountChange = (e) => {
        const newAmount = e.target.value?.trim();
        setProposalData((prev) => ({
            ...prev,
            prop_amount: newAmount,
        }));

        if (newAmount === '') {
            setErrors((prev) => ({
                ...prev,
                amount: false,
            }));
            setHelperText((prev) => ({
                ...prev,
                amount: ``,
            }));
            return;
        }

        const validationResult = numberValidation(newAmount);
        if (validationResult === true) {
            setErrors((prev) => ({
                ...prev,
                amount: false,
            }));
            setHelperText((prev) => ({
                ...prev,
                amount: ``,
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                amount: true,
            }));
            setHelperText((prev) => ({
                ...prev,
                amount: validationResult,
            }));
        }
    };

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

    const handleTextAreaChange = (event, field, errorField) => {
        const value = event?.target?.value;

        setProposalData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (value === '') {
            setHelperText((prev) => ({
                ...prev,
                [errorField]: '',
            }));
            setErrors((prev) => ({
                ...prev,
                [errorField]: false,
            }));
            return;
        }

        let errorMessage = '';
        errorMessage = containsString(value);

        if (errorMessage === true && field === 'prop_name') {
            errorMessage = maxLengthCheck(value, titleMaxLength);
        }

        setHelperText((prev) => ({
            ...prev,
            [errorField]: errorMessage === true ? '' : errorMessage,
        }));

        setErrors((prev) => ({
            ...prev,
            [errorField]: errorMessage === true ? false : true,
        }));
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
                    </Box>

                    <TextField
                        select
                        label='Governance Action Type'
                        value={proposalData?.gov_action_type_id || ''}
                        required
                        fullWidth
                        onChange={handleChange}
                        SelectProps={{
                            SelectDisplayProps: {
                                'data-testid': 'governance-action-type',
                            },
                        }}
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
                            handleTextAreaChange(e, 'prop_name', 'name')
                        }
                        required
                        inputProps={{
                            'data-testid': 'title-input',
                        }}
                        error={errors?.name}
                        helperText={helperText?.name}
                        FormHelperTextProps={{
                            'data-testid': 'title-input-error',
                        }}
                    />

                    <TextField
                        size='large'
                        name='Abstract'
                        label='Abstract'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_abstract || ''}
                        onChange={(e) =>
                            handleTextAreaChange(e, 'prop_abstract', 'abstract')
                        }
                        required
                        helperText={
                            helperText?.abstract ? (
                                helperText?.abstract
                            ) : (
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='abstract-helper-text'
                                    >
                                        * A short summary of your proposal
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='abstract-helper-character-count'
                                    >
                                        {`${
                                            proposalData?.prop_abstract
                                                ?.length || 0
                                        }/${abstractMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: abstractMaxLength,
                                'data-testid': 'abstract-input',
                            },
                        }}
                        error={errors?.abstract}
                        FormHelperTextProps={{
                            'data-testid': errors?.abstract
                                ? 'abstract-helper-error'
                                : 'abstract-helper',
                        }}
                    />

                    <TextField
                        size='large'
                        name='Motivation'
                        label='Motivation'
                        placeholder='This is a problem because...'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_motivation || ''}
                        onChange={(e) =>
                            handleTextAreaChange(
                                e,
                                'prop_motivation',
                                'motivation'
                            )
                        }
                        required
                        helperText={
                            helperText?.motivation ? (
                                helperText?.motivation
                            ) : (
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='motivation-helper-text'
                                    >
                                        * What problem is your proposal solving?
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='motivation-helper-character-count'
                                    >
                                        {`${
                                            proposalData?.prop_motivation
                                                ?.length || 0
                                        }/${motivationRationaleMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: motivationRationaleMaxLength,
                                'data-testid': 'motivation-input',
                            },
                        }}
                        error={errors?.motivation}
                        FormHelperTextProps={{
                            'data-testid': errors?.motivation
                                ? 'motivation-helper-error'
                                : 'motivation-helper',
                        }}
                    />

                    <TextField
                        size='large'
                        name='Rationale'
                        label='Rationale'
                        placeholder='This problem is solved by...'
                        multiline
                        rows={isSmallScreen ? 10 : 4}
                        value={proposalData?.prop_rationale || ''}
                        onChange={(e) =>
                            handleTextAreaChange(
                                e,
                                'prop_rationale',
                                'rationale'
                            )
                        }
                        required
                        helperText={
                            helperText?.rationale ? (
                                helperText?.rationale
                            ) : (
                                <>
                                    <Typography
                                        variant='caption'
                                        data-testid='rationale-helper-text'
                                    >
                                        * How does the on-chain change solve the
                                        problem?
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        sx={{ float: 'right' }}
                                        data-testid='rationale-helper-character-count'
                                    >
                                        {`${
                                            proposalData?.prop_rationale
                                                ?.length || 0
                                        }/${motivationRationaleMaxLength}`}
                                    </Typography>
                                </>
                            )
                        }
                        InputProps={{
                            inputProps: {
                                maxLength: motivationRationaleMaxLength,
                                'data-testid': 'rationale-input',
                            },
                        }}
                        error={errors?.rationale}
                        FormHelperTextProps={{
                            'data-testid': errors?.rationale
                                ? 'rationale-helper-error'
                                : 'rationale-helper',
                        }}
                    />

                    {selectedGovActionName === 'Treasury' ? (
                        <>
                            <TextField
                                margin='normal'
                                label='Receiving stake address'
                                variant='outlined'
                                placeholder='e.g. stake1...'
                                value={
                                    proposalData?.prop_receiving_address || ''
                                }
                                fullWidth
                                onChange={handleAddressChange}
                                required
                                inputProps={{
                                    'data-testid': 'receiving-address-input',
                                }}
                                error={errors?.address}
                                helperText={helperText?.address}
                                FormHelperTextProps={{
                                    'data-testid':
                                        'receiving-address-text-error',
                                }}
                            />

                            <TextField
                                margin='normal'
                                label='Amount'
                                type='tel'
                                variant='outlined'
                                placeholder='e.g. 2000 ada'
                                value={proposalData?.prop_amount || ''}
                                fullWidth
                                onChange={handleAmountChange}
                                required
                                inputProps={{
                                    'data-testid': 'amount-input',
                                }}
                                error={errors?.amount}
                                helperText={helperText?.amount}
                                FormHelperTextProps={{
                                    'data-testid': 'amount-text-error',
                                }}
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
                            Links to additional content or social media contacts
                            (up to 7 entries)
                        </Typography>
                    </Box>

                    <LinkManager
                        proposalData={proposalData}
                        setProposalData={setProposalData}
                        linksErrors={linksErrors}
                        setLinksErrors={setLinksErrors}
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
