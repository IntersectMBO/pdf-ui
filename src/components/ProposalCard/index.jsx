'use client';

import {
    IconChatAlt,
    IconInformationCircle,
    IconLink,
    IconPencilAlt,
    IconShare,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Menu,
    Stack,
    Typography,
    alpha,
    styled,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useTheme } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/context';
import { formatIsoDate } from '../../lib/utils';
import EditProposalDialog from '../EditProposalDialog';

const ProposalCard = ({ proposal, startEdittinButtonClick = false }) => {
    const { user } = useAppContext();
    const navigate = useNavigate();
    const theme = useTheme();

    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [proposalLink, setProposalLink] = useState('');

    useEffect(() => {
        let domain = new URL(window.location.href);
        let origin = domain.origin;
        setProposalLink(`${origin}/proposal_discussion/`);
    }, [proposalLink]);

    const handleEditProposal = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const CardStatusBadge = styled(Badge)(({ theme }) => ({
        width: '100%',
        height: '100%',
        '& .MuiBadge-badge': {
            transform: 'translate(-25px, -15px)',
            color: theme.palette.text.black,
            backgroundColor: theme.palette.badgeColors.lightPurple,
            padding: '14px 12px',
            borderRadius: 100,
        },
    }));

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            transform: 'translate(40px, -30px) !important',
            color: 'white !important',
            backgroundColor: `${theme.palette.badgeColors.error} !important`,
            padding: 'unset !important',
            borderRadius: 'none !important',
        },
    }));

    const CardContentComponent = ({ proposal }) => {
        const disableShareClick = () => {
            setDisableShare(true);
            setTimeout(() => {
                setDisableShare(false);
            }, 2000);
        };

        function copyToClipboard(value) {
            navigator.clipboard.writeText(value);
        }

        const [shareAnchorEl, setShareAnchorEl] = useState(null);
        const [disableShare, setDisableShare] = useState(false);
        const openShare = Boolean(shareAnchorEl);
        const handleShareClick = (event) => {
            setShareAnchorEl(event.currentTarget);
        };

        const handleShareClose = () => {
            setShareAnchorEl(null);
        };
        return (
            <Card
                raised
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    backgroundColor: alpha('#FFFFFF', 0.3),
                    minHeight: '400px',
                }}
                data-testid={
                    proposal?.attributes?.content?.attributes?.is_draft
                        ? `draft-${proposal?.id}-card`
                        : `proposal-${proposal?.id}`
                }
            >
                <CardHeader
                    action={
                        <>
                            <IconButton
                                id='share-button-card'
                                sx={{
                                    width: 40,
                                    height: 40,
                                }}
                                aria-controls={
                                    openShare ? 'share-menu-card' : undefined
                                }
                                aria-haspopup='true'
                                aria-expanded={openShare ? 'true' : undefined}
                                onClick={handleShareClick}
                                data-testid={`proposal-${proposal?.id}-share-button`}
                            >
                                <IconShare
                                    width='24'
                                    height='24'
                                    fill={
                                        openShare
                                            ? theme?.palette?.primary?.main
                                            : theme?.palette?.primary?.icons
                                                  ?.black
                                    }
                                />
                            </IconButton>
                            <Menu
                                id='share-menu-card'
                                anchorEl={shareAnchorEl}
                                open={openShare}
                                onClose={handleShareClose}
                                MenuListProps={{
                                    'aria-labelledby': 'share-button-card',
                                    sx: {
                                        width: '155px',
                                        height: '135px',
                                        maxWidth: '155px',
                                        maxHeight: '135px',
                                        py: 1.5,
                                    },
                                }}
                                slotProps={{
                                    paper: {
                                        elevation: 4,
                                        sx: {
                                            overflow: 'visible',
                                            mt: 1,
                                            width: '155px',
                                            height: '135px',
                                            maxWidth: '155px',
                                            maxHeight: '135px',
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
                                <Stack
                                    direction={'column'}
                                    spacing={2}
                                    px={3}
                                    gap={2}
                                >
                                    <Typography variant='h6' component={'p'}>
                                        Share
                                    </Typography>
                                    <Stack
                                        direction={'column'}
                                        alignItems={'center'}
                                        sx={{ marginTop: '0 !important' }}
                                    >
                                        <IconButton
                                            onClick={() => {
                                                copyToClipboard(
                                                    `${proposalLink}${proposal?.id}`
                                                ),
                                                    disableShareClick();
                                            }}
                                            color='primary'
                                            disabled={disableShare}
                                        >
                                            <IconLink
                                                fill={
                                                    !disableShare
                                                        ? theme?.palette
                                                              ?.primary?.main
                                                        : theme?.palette
                                                              ?.primary?.icons
                                                              ?.grey
                                                }
                                                height={24}
                                                width={24}
                                            />
                                        </IconButton>
                                        <Typography
                                            variant='caption'
                                            component={'p'}
                                            sx={{
                                                color: (theme) =>
                                                    theme.palette.text
                                                        .darkPurple,
                                            }}
                                        >
                                            {disableShare
                                                ? 'Link copied'
                                                : 'Click to copy link'}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Menu>
                        </>
                    }
                    title={
                        <>
                            <Typography
                                variant='h6'
                                component='h3'
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    lineClamp: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                data-testid={`proposal-${proposal?.id}-title`}
                            >
                                {
                                    proposal?.attributes?.content?.attributes
                                        ?.prop_name
                                }
                            </Typography>
                            <Typography
                                variant='body2'
                                component={'h5'}
                                sx={{
                                    color: (theme) =>
                                        theme?.palette?.text?.darkPurple,
                                }}
                                mt={1}
                            >
                                @{proposal?.attributes?.user_govtool_username}
                            </Typography>
                        </>
                    }
                />
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        gap={2}
                        mb={3}
                    >
                        <Box>
                            <Typography
                                variant='caption'
                                component='p'
                                color='text.grey'
                            >
                                Abstract
                            </Typography>
                            <Typography
                                variant='body2'
                                component='p'
                                color='text.darkPurple'
                                sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3,
                                    lineClamp: 3,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {
                                    proposal?.attributes?.content?.attributes
                                        ?.prop_abstract
                                }
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant='caption'
                                component='p'
                                color='text.grey'
                            >
                                Governance Action Type
                            </Typography>
                            <Typography
                                variant='body2'
                                component='p'
                                color='text.darkPurple'
                            >
                                {
                                    proposal?.attributes?.content?.attributes
                                        ?.gov_action_type?.attributes
                                        ?.gov_action_type_name
                                }
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        mt={'auto'}
                        gap={3}
                        pt={3}
                    >
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={1}
                            py={1}
                            px={1}
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.divider.primary,
                                borderRadius: '14px',
                            }}
                        >
                            <IconInformationCircle
                                color={theme.palette.primary.icons.black}
                            />
                            <Typography
                                variant='body2'
                                component='p'
                                color='text.black'
                            >
                                {proposal?.attributes?.content?.attributes
                                    ?.is_draft
                                    ? 'Not submitted'
                                    : `Proposed on: ${formatIsoDate(
                                          proposal?.attributes?.createdAt
                                      )}`}
                            </Typography>
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                        >
                            {proposal?.attributes?.content?.attributes
                                ?.is_draft ? null : (
                                <Box display={'flex'} gap={1}>
                                    <IconButton
                                        data-testid={`proposal-${proposal?.id}-comment-count`}
                                        disabled={true}
                                    >
                                        <StyledBadge
                                            badgeContent={
                                                proposal?.attributes
                                                    ?.prop_comments_number || 0
                                            }
                                            aria-label='comments'
                                            showZero
                                        ></StyledBadge>
                                        <IconChatAlt />
                                    </IconButton>
                                    {user &&
                                        user?.user?.id?.toString() ===
                                            proposal?.attributes?.user_id?.toString() && (
                                            <IconButton
                                                aria-label='edit'
                                                onClick={handleEditProposal}
                                                data-testid={`proposal-${proposal?.id}-edit-button`}
                                            >
                                                <IconPencilAlt />
                                            </IconButton>
                                        )}
                                </Box>
                            )}

                            {proposal?.attributes?.content?.attributes
                                ?.is_draft ? (
                                <Button
                                    variant='contained'
                                    fullWidth
                                    onClick={() =>
                                        startEdittinButtonClick(proposal)
                                    }
                                    data-testid={`draft-${proposal?.id}-start-editing`}
                                >
                                    Start Editing
                                </Button>
                            ) : (
                                <Link
                                    to={`/proposal_discussion/${proposal?.id}`}
                                    data-testid={`proposal-${proposal?.id}-view-details-link-wrapper`}
                                >
                                    <Button
                                        variant='contained'
                                        data-testid={`proposal-${proposal?.id}-view-details`}
                                    >
                                        View Details
                                    </Button>
                                </Link>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return proposal?.attributes?.content?.attributes?.is_draft ? (
        <CardStatusBadge
            badgeContent={'Draft'}
            aria-label='draft-badge'
            showZero
        >
            <CardContentComponent proposal={proposal} />
        </CardStatusBadge>
    ) : (
        <Box>
            <CardContentComponent proposal={proposal} />

            {openEditDialog && (
                <EditProposalDialog
                    proposal={proposal}
                    openEditDialog={openEditDialog}
                    handleCloseEditDialog={handleCloseEditDialog}
                    setMounted={() => {}}
                    onUpdate={() =>
                        navigate(`/proposal_discussion/${proposal?.id}`)
                    }
                />
            )}
        </Box>
    );
};

export default ProposalCard;
