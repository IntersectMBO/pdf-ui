'use client';

import { useTheme } from '@emotion/react';
import {
    IconFilter,
    IconSearch,
    IconSort,
    IconPlusCircle,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Typography,
    Button,
    Tooltip,
    Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ProposalsList } from '../../components';
import { getGovernanceActionTypes } from '../../lib/api';
import { useAppContext } from '../../context/context';
import { useNavigate } from 'react-router-dom';

const ProposedGovernanceActions = () => {
    const theme = useTheme();
    const { user } = useAppContext();
    const navigate = useNavigate();
    const [proposalSearchText, setProposalSearchText] = useState('');
    const [sortType, setSortType] = useState('desc');
    const [governanceActionTypeList, setGovernanceActionTypeList] = useState(
        []
    );
    const [
        filteredGovernanceActionTypeList,
        setFilteredGovernanceActionTypeList,
    ] = useState([]);

    const [
        filteredGovernanceActionStatusList,
        setFilteredGovernanceActionStatusList,
    ] = useState(['active']);

    const [filtersAnchorEl, setFiltersAnchorEl] = useState(null);
    const openFilters = Boolean(filtersAnchorEl);
    const handleFiltersClick = (event) => {
        setFiltersAnchorEl(event.currentTarget);
    };
    const handleCloseFilters = () => {
        setFiltersAnchorEl(null);
    };

    const fetchGovernanceActionTypes = async () => {
        try {
            let response = await getGovernanceActionTypes();

            if (!response?.data) return;

            setGovernanceActionTypeList(response?.data);
            // setFilteredGovernanceActionTypeList(response?.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleActionFilter = (action) => {
        let filterExist = filteredGovernanceActionTypeList?.some(
            (filter) => filter?.id === action?.id
        );

        let updatedList;
        if (filterExist) {
            updatedList = filteredGovernanceActionTypeList.filter(
                (filter) => filter?.id !== action?.id
            );
        } else {
            updatedList = [...filteredGovernanceActionTypeList, action];
        }

        updatedList.sort((a, b) => a?.id - b?.id);

        setFilteredGovernanceActionTypeList(updatedList);
    };

    const toggleStatusFilter = (status) => {
        let filterExist = filteredGovernanceActionStatusList?.some(
            (filter) => filter === status
        );

        let updatedList;
        if (filterExist) {
            updatedList = filteredGovernanceActionStatusList.filter(
                (filter) => filter !== status
            );
        } else {
            updatedList = [...filteredGovernanceActionStatusList, status];
        }

        setFilteredGovernanceActionStatusList(updatedList);
    };

    const resetFilters = () => {
        setFilteredGovernanceActionTypeList([]);
        setFilteredGovernanceActionStatusList(['active']);
        handleCloseFilters();
    };

    useEffect(() => {
        fetchGovernanceActionTypes();
    }, []);

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container spacing={3} flexDirection={'column'}>
                <Grid item display={'flex'} flexDirection={'row'} xs={12}>
                    <Grid
                        container
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        spacing={1}
                    >
                        {user?.user?.govtool_username ? (
                            <Grid item xs={12} paddingBottom={2}>
                                <Button
                                    variant='contained'
                                    onClick={() =>
                                        navigate(
                                            '/proposal_discussion/create-governance-action'
                                        )
                                    }
                                    startIcon={<IconPlusCircle fill='white' />}
                                    data-testid='propose-a-governance-action-button'
                                >
                                    Propose a Governance Action
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12} paddingBottom={2}>
                                <Typography variant='h4' component='h1'>
                                    Proposed Governance Actions
                                </Typography>
                            </Grid>
                        )}
                        <Grid item md={6} sx={{ flexGrow: { xs: 1 } }}>
                            <TextField
                                fullWidth
                                id='outlined-basic'
                                data-testid='search-input'
                                placeholder='Search...'
                                variant='outlined'
                                value={proposalSearchText || ''}
                                onChange={(e) =>
                                    setProposalSearchText(e.target.value)
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <IconSearch
                                                color={
                                                    theme.palette.primary.icons
                                                        .black
                                                }
                                                width={24}
                                                height={24}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '.MuiOutlinedInput-root': {
                                        borderRadius: 100,
                                        backgroundColor: 'white',
                                        input: {
                                            '&::placeholder': {
                                                color: (theme) =>
                                                    theme.palette.text.grey,
                                                opacity: 1,
                                            },
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Box gap={1} display={'flex'}>
                                <Tooltip title='Filters'>
                                    <IconButton
                                        id='filters-button'
                                        data-testid='filter-button'
                                        sx={{
                                            width: 40,
                                            height: 40,
                                        }}
                                        aria-controls={
                                            openFilters
                                                ? 'filters-menu'
                                                : undefined
                                        }
                                        aria-haspopup='true'
                                        aria-expanded={
                                            openFilters ? 'true' : undefined
                                        }
                                        onClick={handleFiltersClick}
                                    >
                                        <IconFilter
                                            color={
                                                theme.palette.primary.icons
                                                    .black
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    id='filters-menu'
                                    anchorEl={filtersAnchorEl}
                                    open={openFilters}
                                    onClose={handleCloseFilters}
                                    MenuListProps={{
                                        'aria-labelledby': 'filters-button',
                                    }}
                                    slotProps={{
                                        paper: {
                                            elevation: 4,
                                            sx: {
                                                overflow: 'visible',
                                                mt: 1,
                                            },
                                        },
                                    }}
                                    transformOrigin={{
                                        horizontal: 'right',
                                        vertical: 'top',
                                    }}
                                    anchorOrigin={{
                                        horizontal: 'right',
                                        vertical: 'bottom',
                                    }}
                                >
                                    <Box px={2}>
                                        <Typography
                                            variant='body1'
                                            sx={{
                                                mb: 1,
                                            }}
                                        >
                                            Proposals types
                                        </Typography>
                                        <Divider
                                            sx={{
                                                color: (theme) => ({
                                                    borderColor:
                                                        theme.palette.border
                                                            .lightGray,
                                                }),
                                            }}
                                        />
                                        {governanceActionTypeList?.map(
                                            (ga, index) => (
                                                <MenuItem
                                                    key={`${ga?.attributes?.gov_action_type_name}-${index}`}
                                                    selected={filteredGovernanceActionTypeList?.some(
                                                        (filter) =>
                                                            filter?.id ===
                                                            ga?.id
                                                    )}
                                                    id={`${ga?.attributes?.gov_action_type_name}-radio-wrapper`}
                                                    data-testid={`${ga?.attributes?.gov_action_type_name}-radio-wrapper`}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                onChange={() =>
                                                                    toggleActionFilter(
                                                                        ga
                                                                    )
                                                                }
                                                                checked={filteredGovernanceActionTypeList?.some(
                                                                    (filter) =>
                                                                        filter?.id ===
                                                                        ga?.id
                                                                )}
                                                                id={`${ga?.attributes?.gov_action_type_name}-radio`}
                                                                data-testid={`${ga?.attributes?.gov_action_type_name}-radio`}
                                                            />
                                                        }
                                                        label={
                                                            ga?.attributes
                                                                ?.gov_action_type_name
                                                        }
                                                    />
                                                </MenuItem>
                                            )
                                        )}

                                        <Typography
                                            variant='body1'
                                            sx={{ mb: 1, mt: 2 }}
                                        >
                                            Proposals status
                                        </Typography>
                                        <Divider
                                            sx={{
                                                color: (theme) => ({
                                                    borderColor:
                                                        theme.palette.border
                                                            .lightGray,
                                                }),
                                            }}
                                        />
                                        <MenuItem
                                            selected={filteredGovernanceActionStatusList?.some(
                                                (filter) =>
                                                    filter === 'submitted'
                                            )}
                                            id={`submitted-for-vote-radio-wrapper`}
                                            data-testid={`submitted-for-vote-radio-wrapper`}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleStatusFilter(
                                                                'submitted'
                                                            )
                                                        }
                                                        checked={filteredGovernanceActionStatusList?.some(
                                                            (filter) =>
                                                                filter ===
                                                                'submitted'
                                                        )}
                                                        id={`submitted-for-vote-radio`}
                                                        data-testid={`submitted-for-vote-radio`}
                                                    />
                                                }
                                                label={'Submitted for vote'}
                                            />
                                        </MenuItem>
                                        <MenuItem
                                            selected={filteredGovernanceActionStatusList?.some(
                                                (filter) => filter === 'active'
                                            )}
                                            id={`active-proposal-radio-wrapper`}
                                            data-testid={`active-proposal-radio-wrapper`}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        onChange={() =>
                                                            toggleStatusFilter(
                                                                'active'
                                                            )
                                                        }
                                                        checked={filteredGovernanceActionStatusList?.some(
                                                            (filter) =>
                                                                filter ===
                                                                'active'
                                                        )}
                                                        id={`active-proposal-radio`}
                                                        data-testid={`active-proposal-radio`}
                                                    />
                                                }
                                                label={'Active proposal'}
                                            />
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => resetFilters()}
                                            data-testid='reset-filters'
                                        >
                                            <Typography color={'primary'}>
                                                Reset filters
                                            </Typography>
                                        </MenuItem>
                                    </Box>
                                </Menu>
                                <Tooltip title='Sort'>
                                    <IconButton
                                        id='sort-button'
                                        data-testid='sort-button'
                                        onClick={() =>
                                            setSortType((prev) =>
                                                prev === 'desc' ? 'asc' : 'desc'
                                            )
                                        }
                                    >
                                        <IconSort
                                            color={
                                                theme.palette.primary.icons
                                                    .black
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box>
                {(filteredGovernanceActionTypeList?.length > 0
                    ? filteredGovernanceActionTypeList
                    : governanceActionTypeList
                )?.map((item, index) => (
                    <Box
                        key={`${item?.attributes?.gov_action_type_name}-${index}`}
                        pt={index === 0 && 4}
                    >
                        <ProposalsList
                            governanceAction={item}
                            searchText={proposalSearchText}
                            sortType={sortType}
                            statusList={filteredGovernanceActionStatusList}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ProposedGovernanceActions;
