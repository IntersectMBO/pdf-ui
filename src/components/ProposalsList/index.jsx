'use client';

import {
    IconCheveronLeft,
    IconCheveronRight,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Stack,
    Typography,
    alpha,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { ProposalCard } from '..';
import { useDebounce } from '../..//lib/hooks';
import { getProposals } from '../../lib/api';
import { settings } from '../../lib/carouselSettings';

const ProposalsList = ({
    governanceAction,
    searchText = '',
    sortType = 'desc',
    isDraft = false,
    statusList = [],
    startEdittinButtonClick = false,
}) => {
    const sliderRef = useRef(null);

    const [showAll, setShowAll] = useState(false);
    const [proposalsList, setProposalsList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mounted, setMounted] = useState(false);
    const debouncedSearchValue = useDebounce(searchText);

    const fetchProposals = async (reset = true, page) => {
        const haveSubmittedFilter = statusList?.some(
            (filter) => filter === 'submitted'
        );

        try {
            let query = '';
            if (isDraft) {
                if (statusList?.length === 0 || statusList?.length === 2) {
                    query = `filters[$and][2][is_draft]=true&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links`;
                } else {
                    const isSubmitted = haveSubmittedFilter ? 'true' : 'false';
                    query = `filters[$and][2][is_draft]=true&filters[$and][3][prop_submitted]=${isSubmitted}&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links`;
                }
            } else {
                if (statusList?.length === 0 || statusList?.length === 2) {
                    query = `filters[$and][0][gov_action_type_id]=${
                        governanceAction?.id
                    }&filters[$and][1][prop_name][$containsi]=${
                        debouncedSearchValue || ''
                    }&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links`;
                } else {
                    const isSubmitted = haveSubmittedFilter ? 'true' : 'false';
                    query = `filters[$and][0][gov_action_type_id]=${
                        governanceAction?.id
                    }&filters[$and][1][prop_name][$containsi]=${
                        debouncedSearchValue || ''
                    }&filters[$and][2][prop_submitted]=${isSubmitted}&pagination[page]=${page}&pagination[pageSize]=25&sort[createdAt]=${sortType}&populate[0]=proposal_links`;
                }
            }
            const { proposals, pgCount } = await getProposals(query);
            if (!proposals) return;

            if (reset) {
                setProposalsList(proposals);
            } else {
                setProposalsList((prev) => [...prev, ...proposals]);
            }

            setPageCount(pgCount);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            fetchProposals(true, 1);
            setCurrentPage(1);
        }
    }, [mounted, debouncedSearchValue, sortType, statusList]);

    return isDraft && proposalsList?.length === 0 ? null : (
        <Box overflow={'hidden'}>
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <Box display={'flex'} alignItems={'center'}>
                    <Typography
                        variant='h5'
                        component='h2'
                        color='text.black'
                        marginRight={2}
                    >
                        {isDraft
                            ? 'Unfinished Drafts'
                            : governanceAction?.attributes
                                  ?.gov_action_type_name}
                    </Typography>
                    {proposalsList?.length > 0 && (
                        <Button
                            variant='outlined'
                            onClick={() => setShowAll((prev) => !prev)}
                            data-testid='show-all-button'
                        >
                            {showAll ? 'Show less' : 'Show all'}
                        </Button>
                    )}
                </Box>

                {!showAll && proposalsList?.length > 0 && (
                    <Box display={'flex'} alignItems={'center'}>
                        <IconButton
                            onClick={() => sliderRef.current.slickPrev()}
                        >
                            <IconCheveronLeft width={20} height={20} />
                        </IconButton>
                        <IconButton
                            onClick={() => sliderRef.current.slickNext()}
                        >
                            <IconCheveronRight width={20} height={20} />
                        </IconButton>
                    </Box>
                )}
            </Box>
            {proposalsList?.length > 0 ? (
                showAll ? (
                    <Box px={1.5}>
                        <Grid container spacing={2} paddingY={4}>
                            {proposalsList?.map((proposal, index) => (
                                <Grid item key={index} xs={12} sm={6} md={4}>
                                    <ProposalCard
                                        proposal={proposal}
                                        startEdittinButtonClick={
                                            startEdittinButtonClick
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {currentPage < pageCount && (
                            <Box
                                marginY={2}
                                display={'flex'}
                                justifyContent={'flex-end'}
                            >
                                <Button
                                    onClick={() => {
                                        fetchProposals(false, currentPage + 1);
                                        setCurrentPage((prev) => prev + 1);
                                    }}
                                >
                                    Load more
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box px={1.5} py={2}>
                        <Slider ref={sliderRef} {...settings}>
                            {proposalsList?.map((proposal, index) => (
                                <Box key={index} height={'100%'}>
                                    <ProposalCard
                                        proposal={proposal}
                                        startEdittinButtonClick={
                                            startEdittinButtonClick
                                        }
                                    />
                                </Box>
                            ))}

                            <Box></Box>
                            <Box></Box>
                            <Box></Box>
                            <Box></Box>
                        </Slider>
                    </Box>
                )
            ) : (
                <Card
                    variant='outlined'
                    sx={{
                        backgroundColor: alpha('#FFFFFF', 0.3),
                        my: 3,
                        mx: 1,
                    }}
                >
                    <CardContent>
                        <Stack
                            display={'flex'}
                            direction={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            gap={1}
                        >
                            <Typography
                                variant='h6'
                                color='text.black'
                                fontWeight={600}
                            >
                                No proposals found
                            </Typography>
                            <Typography variant='body1' color='text.black'>
                                Please try a different search
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ProposalsList;
