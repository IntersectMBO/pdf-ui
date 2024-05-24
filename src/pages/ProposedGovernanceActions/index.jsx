'use client';

import { useTheme } from '@emotion/react';
import {
    IconFilter,
    IconSearch,
    IconSort,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ProposalsList } from '../../components';
import { getGovernanceActionTypes } from '../../lib/api';

const ProposedGovernanceActions = () => {
    const theme = useTheme();
    const [proposalSearchText, setProposalSearchText] = useState('');
    const [sortType, setSortType] = useState('desc');
    const [governanceActionTypeList, setGovernanceActionTypeList] = useState(
        []
    );

    const fetchGovernanceActionTypes = async () => {
        try {
            let response = await getGovernanceActionTypes();

            if (!response?.data) return;

            setGovernanceActionTypeList(response?.data);
        } catch (error) {
            console.error(error);
        }
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
                        <Grid item md={6} sx={{ flexGrow: { xs: 1 } }}>
                            <TextField
                                fullWidth
                                id='outlined-basic'
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
                                <IconButton>
                                    <IconFilter
                                        color={
                                            theme.palette.primary.icons.black
                                        }
                                    />
                                </IconButton>
                                <IconButton
                                    onClick={() =>
                                        setSortType((prev) =>
                                            prev === 'desc' ? 'asc' : 'desc'
                                        )
                                    }
                                >
                                    <IconSort
                                        color={
                                            theme.palette.primary.icons.black
                                        }
                                    />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box>
                {governanceActionTypeList?.map((item, index) => (
                    <Box
                        key={`${item?.attributes?.gov_action_type_name}-${index}`}
                        pt={index === 0 && 4}
                    >
                        <ProposalsList
                            governanceAction={item}
                            searchText={proposalSearchText}
                            sortType={sortType}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ProposedGovernanceActions;
