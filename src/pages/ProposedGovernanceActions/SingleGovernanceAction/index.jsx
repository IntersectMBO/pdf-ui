import { useTheme } from '@emotion/react';
import {
    IconChatAlt,
    IconCheveronLeft,
    IconDocumentSearch,
    IconDotsVertical,
    IconInformationCircle,
    IconLink,
    IconPencilAlt,
    IconReply,
    IconShare,
    IconSort,
    IconThumbDown,
    IconThumbUp,
    IconTrash,
    IconX,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Stack,
    TextField,
    Tooltip,
    Typography,
    alpha,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CommentCard,
    EditProposalDialog,
    Poll,
    ReviewVersions,
    ProposalSubmissionDialog,
} from '../../../components';
import { useAppContext } from '../../../context/context';
import {
    createComment,
    createProposalLikeOrDislike,
    deleteProposal,
    getComments,
    getSingleProposal,
    getUserProposalVote,
    updateProposalLikesOrDislikes,
} from '../../../lib/api';
import { formatIsoDate } from '../../../lib/utils';

const SingleGovernanceAction = ({ id }) => {
    const MAX_COMMENT_LENGTH = 256;
    const navigate = useNavigate();
    const { user, setLoading } = useAppContext();
    const theme = useTheme();
    const [proposal, setProposal] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [userProposalVote, setUserProposalVote] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [reviewVersionsOpen, setReviewVersionsOpen] = useState(false);
    const [commentsPageCount, setCommentsPageCount] = useState(0);
    const [commentsCurrentPage, setCommentsCurrentPage] = useState(1);
    const [commentsSortType, setCommentsSortType] = useState('desc');
    const [proposalLink, setProposalLink] = useState('');
    const [disableShare, setDisableShare] = useState(false);
    const [openGASubmissionDialog, setOpenGASubmissionDialog] = useState(false);

    useEffect(() => {
        let domain = new URL(window.location.href);
        let origin = domain.origin;
        setProposalLink(`${origin}/proposal_discussion/`);
    }, [proposalLink]);

    const disableShareClick = () => {
        setDisableShare(true);
        setTimeout(() => {
            setDisableShare(false);
        }, 2000);
    };

    function copyToClipboard(value) {
        navigator.clipboard.writeText(value);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [shareAnchorEl, setShareAnchorEl] = useState(null);
    const openShare = Boolean(shareAnchorEl);
    const handleShareClick = (event) => {
        setShareAnchorEl(event.currentTarget);
    };

    const handleShareClose = () => {
        setShareAnchorEl(null);
    };

    const handleEditProposal = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setAnchorEl(null);
    };

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const handleOpenReviewVersions = () => setReviewVersionsOpen(true);
    const handleCloseReviewVersions = () => setReviewVersionsOpen(false);

    const handleDeleteProposal = async () => {
        setLoading(true);
        try {
            const response = await deleteProposal(proposal?.id);
            if (!response) return;

            handleCloseDeleteModal();
            navigate('/proposal_discussion');
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposal = async (id) => {
        setLoading(true);
        try {
            const response = await getSingleProposal(id);
            if (!response) return;
            setProposal(response);
        } catch (error) {
            if (
                error?.response?.data?.error?.details === 'Proposal not found'
            ) {
                return navigate('/proposal_discussion');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposalVote = async (id) => {
        setLoading(true);
        try {
            const response = await getUserProposalVote({ proposalID: id });
            setUserProposalVote(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (page = 1) => {
        setLoading(true);
        try {
            const query = `filters[$and][0][proposal_id]=${id}&filters[$and][1][comment_parent_id][$null]=true&sort[createdAt]=${commentsSortType}&pagination[page]=${page}&pagination[pageSize]=25`;
            const { comments, pgCount } = await getComments(query);
            if (!comments) return;
            setCommentsPageCount(pgCount);

            if (page > commentsCurrentPage) {
                setCommentsList((prev) => [...prev, ...comments]);
            } else {
                if (page === 1) {
                    setCommentsCurrentPage(1);
                }
                setCommentsList(comments);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComment = async () => {
        setLoading(true);
        try {
            const newComment = await createComment({
                proposal_id: id,
                comment_text: newCommentText,
            });

            if (!newComment) return;
            setNewCommentText('');
            fetchProposal(id);
            fetchComments(1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateLikesOrDislikes = async ({ like = true }) => {
        setLoading(true);
        try {
            let data = userProposalVote
                ? {
                      vote_result: !userProposalVote?.attributes?.vote_result,
                  }
                : {
                      proposal_id: id,
                      vote_result: like,
                  };

            const response = userProposalVote
                ? await updateProposalLikesOrDislikes({
                      proposalVoteID: userProposalVote?.id,
                      updateData: data,
                  })
                : await createProposalLikeOrDislike({ createData: data });

            if (!response) return;

            setUserProposalVote(response);
            fetchProposal(id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleChange = (event) => {
        let value = event.target.value;

        if (value.startsWith(' ')) {
            value = value.trimStart();
        }

        value = value.replace(/  +/g, ' ');

        if (value.length <= MAX_COMMENT_LENGTH) {
            setNewCommentText(value);
        }
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        } else {
            fetchProposal(id);
            fetchComments(1);
        }
    }, [id, mounted]);

    useEffect(() => {
        if (mounted && user) {
            if (user) fetchProposalVote(id);
        }
    }, [user, mounted, id]);

    useEffect(() => {
        if (mounted) {
            fetchComments(1);
        }
    }, [commentsSortType]);

    return (
        <>
            {openEditDialog ? (
                <EditProposalDialog
                    proposal={proposal}
                    openEditDialog={openEditDialog}
                    handleCloseEditDialog={handleCloseEditDialog}
                    setMounted={setMounted}
                />
            ) : (
                <Box>
                    <Box mt={3}>
                        <Button
                            startIcon={
                                <IconCheveronLeft
                                    width='18'
                                    height='18'
                                    fill={theme.palette.primary.main}
                                />
                            }
                            onClick={() => navigate(`/proposal_discussion`)}
                        >
                            Show all
                        </Button>
                    </Box>

                    <Box mt={4}>
                        <Card
                            variant='outlined'
                            sx={{
                                backgroundColor: alpha('#FFFFFF', 0.3),
                            }}
                        >
                            <CardHeader
                                sx={{
                                    pt: 1,
                                    pb: 1,
                                    backgroundColor: alpha('#F2F4F8', 0.7),
                                }}
                                title={
                                    <Box
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        flexDirection={'row'}
                                    >
                                        <Typography
                                            variant='caption'
                                            component='p'
                                        >
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_submitted
                                                ? `Submitted for vote on: ${formatIsoDate(proposal?.attributes?.content?.attributes?.prop_submission_date)}`
                                                : `Proposed on: ${formatIsoDate(
                                                      proposal?.attributes
                                                          ?.createdAt
                                                  )}`}
                                        </Typography>
                                        <Tooltip
                                            title={
                                                proposal?.attributes?.content
                                                    ?.attributes
                                                    ?.prop_submitted ? (
                                                    <span
                                                        style={{
                                                            whiteSpace:
                                                                'pre-line',
                                                        }}
                                                    >
                                                        {`Proposal Date\n\nThe date
                                                        when Proposal was
                                                        submitted as Governance
                                                        Action.`}
                                                    </span>
                                                ) : (
                                                    'Proposal Date'
                                                )
                                            }
                                        >
                                            <Box>
                                                <IconInformationCircle
                                                    width={16}
                                                    height={16}
                                                    fill={
                                                        theme?.palette?.primary
                                                            ?.icons?.grey
                                                    }
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                }
                            ></CardHeader>
                            {
                                <CardContent>
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                        flexDirection={{
                                            xs: 'column',
                                            sm: 'row',
                                        }}
                                    >
                                        <Box
                                            textAlign={{
                                                xs: 'center',
                                                sm: 'left',
                                            }}
                                        >
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_submitted ? (
                                                <Typography variant='caption'>
                                                    This proposal has been
                                                    submitted on-chain as a
                                                    Governance Action to get
                                                    voted on.
                                                </Typography>
                                            ) : (
                                                <>
                                                    <Typography variant='body2'>
                                                        Your Action:
                                                    </Typography>
                                                    <Typography variant='caption'>
                                                        If your are ready,
                                                        submit this proposal as
                                                        a governance action to
                                                        get voted on.
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>

                                        <Box>
                                            {proposal?.attributes?.content
                                                ?.attributes?.prop_submitted ? (
                                                <Button
                                                    variant='outlined'
                                                    data-testid='review-and-vote-button'
                                                    onClick={() =>
                                                        navigate(
                                                            `/connected/governance_actions/${proposal?.attributes?.content?.attributes?.prop_submission_tx_hash}#0`
                                                        )
                                                    }
                                                    endIcon={
                                                        <IconDocumentSearch
                                                            width={18}
                                                            height={18}
                                                            fill={
                                                                theme.palette
                                                                    .primary
                                                                    .main
                                                            }
                                                        />
                                                    }
                                                >
                                                    Review and Vote
                                                </Button>
                                            ) : user &&
                                              user?.user?.id?.toString() ===
                                                  proposal?.attributes?.user_id?.toString() ? (
                                                <Button
                                                    variant='outlined'
                                                    data-testid='submit-as-GA-button'
                                                    onClick={() =>
                                                        setOpenGASubmissionDialog(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Submit as Governance Action
                                                </Button>
                                            ) : null}
                                        </Box>
                                    </Box>
                                </CardContent>
                            }
                        </Card>
                    </Box>

                    <Box mt={4}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <Typography variant='h4' component='h2'>
                                            {
                                                proposal?.attributes?.content
                                                    ?.attributes?.prop_name
                                            }
                                        </Typography>
                                        <Typography
                                            variant='body2'
                                            component={'h5'}
                                            sx={{
                                                color: (theme) =>
                                                    theme?.palette?.text?.black,
                                                mt: 1,
                                            }}
                                        >
                                            @
                                            {
                                                proposal?.attributes
                                                    ?.user_govtool_username
                                            }
                                        </Typography>
                                    </Grid>

                                    {/* SHARE BUTTON */}
                                    <Grid
                                        item
                                        xs={2}
                                        display='flex'
                                        justifyContent='flex-end'
                                    >
                                        <IconButton
                                            id='share-button'
                                            sx={{
                                                width: 40,
                                                height: 40,
                                            }}
                                            aria-controls={
                                                openShare
                                                    ? 'share-menu'
                                                    : undefined
                                            }
                                            aria-haspopup='true'
                                            aria-expanded={
                                                openShare ? 'true' : undefined
                                            }
                                            onClick={handleShareClick}
                                        >
                                            <IconShare
                                                width='24'
                                                height='24'
                                                fill={
                                                    openShare
                                                        ? theme?.palette
                                                              ?.primary?.main
                                                        : theme?.palette
                                                              ?.primary?.icons
                                                              ?.black
                                                }
                                            />
                                        </IconButton>
                                        <Menu
                                            id='share-menu'
                                            anchorEl={shareAnchorEl}
                                            open={openShare}
                                            onClose={handleShareClose}
                                            MenuListProps={{
                                                'aria-labelledby':
                                                    'share-button',
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
                                                <Typography
                                                    variant='h6'
                                                    component={'p'}
                                                >
                                                    Share
                                                </Typography>
                                                <Stack
                                                    direction={'column'}
                                                    alignItems={'center'}
                                                    sx={{
                                                        marginTop:
                                                            '0 !important',
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={() => {
                                                            copyToClipboard(
                                                                `${proposalLink}${id}`
                                                            ),
                                                                disableShareClick();
                                                        }}
                                                        color='primary'
                                                        disabled={disableShare}
                                                    >
                                                        <IconLink
                                                            fill={
                                                                !disableShare
                                                                    ? theme
                                                                          ?.palette
                                                                          ?.primary
                                                                          ?.main
                                                                    : theme
                                                                          ?.palette
                                                                          ?.primary
                                                                          ?.icons
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
                                                                theme.palette
                                                                    .text
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

                                        {user &&
                                            user?.user?.id?.toString() ===
                                                proposal?.attributes?.user_id?.toString() &&
                                            !proposal?.attributes?.content
                                                ?.attributes
                                                ?.prop_submitted && (
                                                <Box
                                                    display='flex'
                                                    justifyContent='flex-end'
                                                >
                                                    <IconButton
                                                        id='menu-button'
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                        }}
                                                        aria-controls={
                                                            open
                                                                ? 'proposal-menu'
                                                                : undefined
                                                        }
                                                        aria-haspopup='true'
                                                        aria-expanded={
                                                            open
                                                                ? 'true'
                                                                : undefined
                                                        }
                                                        onClick={handleClick}
                                                        data-testid='menu-button'
                                                    >
                                                        <IconDotsVertical
                                                            width='24'
                                                            height='24'
                                                        />
                                                    </IconButton>
                                                    <Menu
                                                        id='proposal-menu'
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        MenuListProps={{
                                                            'aria-labelledby':
                                                                'menu-button',
                                                        }}
                                                        slotProps={{
                                                            paper: {
                                                                elevation: 4,
                                                                sx: {
                                                                    overflow:
                                                                        'visible',
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
                                                        data-testid='proposal-menu'
                                                    >
                                                        <MenuItem
                                                            onClick={
                                                                handleEditProposal
                                                            }
                                                            data-testid='edit-proposal'
                                                        >
                                                            <Stack
                                                                direction={
                                                                    'row'
                                                                }
                                                                spacing={2}
                                                                alignItems={
                                                                    'center'
                                                                }
                                                            >
                                                                <IconPencilAlt
                                                                    color={
                                                                        theme
                                                                            .palette
                                                                            .primary
                                                                            .icons
                                                                            .black
                                                                    }
                                                                    height={24}
                                                                    width={24}
                                                                />
                                                                <Typography variant='body1'>
                                                                    Edit
                                                                    Proposal
                                                                </Typography>
                                                            </Stack>
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={
                                                                handleOpenDeleteModal
                                                            }
                                                            data-testid='delete-proposal'
                                                        >
                                                            <Stack
                                                                direction={
                                                                    'row'
                                                                }
                                                                spacing={2}
                                                                alignItems={
                                                                    'center'
                                                                }
                                                            >
                                                                <IconTrash
                                                                    color={
                                                                        theme
                                                                            .palette
                                                                            .primary
                                                                            .icons
                                                                            .black
                                                                    }
                                                                    height={24}
                                                                    width={24}
                                                                />
                                                                <Typography variant='body1'>
                                                                    Delete
                                                                    Proposal
                                                                </Typography>
                                                            </Stack>
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            )}
                                    </Grid>
                                </Grid>

                                <Box mt={2}>
                                    <Typography variant='caption'>
                                        Governance Action Type
                                    </Typography>
                                    <Typography variant='body2'>
                                        {
                                            proposal?.attributes?.content
                                                ?.attributes?.gov_action_type
                                                ?.attributes
                                                ?.gov_action_type_name
                                        }
                                    </Typography>
                                </Box>

                                <Box
                                    mt={2}
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                >
                                    <Typography variant='caption'>
                                        {`Last Edit: ${formatIsoDate(
                                            proposal?.attributes?.content
                                                ?.attributes?.createdAt
                                        )}`}
                                    </Typography>
                                    {user?.user?.id?.toString() ===
                                        proposal?.attributes?.user_id?.toString() && (
                                        <Box>
                                            <Button
                                                variant='outlined'
                                                startIcon={
                                                    <IconLink
                                                        fill={
                                                            theme.palette
                                                                .primary.main
                                                        }
                                                        width='18'
                                                        height='18'
                                                    />
                                                }
                                                onClick={
                                                    handleOpenReviewVersions
                                                }
                                                data-testid='review-version'
                                            >
                                                Review Versions
                                            </Button>

                                            <ReviewVersions
                                                open={reviewVersionsOpen}
                                                onClose={
                                                    handleCloseReviewVersions
                                                }
                                                id={id}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                <Box mt={4}>
                                    <Typography variant='caption'>
                                        Abstract
                                    </Typography>
                                    <Typography variant='body2'>
                                        {
                                            proposal?.attributes?.content
                                                ?.attributes?.prop_abstract
                                        }
                                    </Typography>
                                </Box>
                                <Box mt={4}>
                                    <Typography variant='caption'>
                                        Motivation
                                    </Typography>
                                    <Typography variant='body2'>
                                        {
                                            proposal?.attributes?.content
                                                ?.attributes?.prop_motivation
                                        }
                                    </Typography>
                                </Box>
                                <Box mt={4}>
                                    <Typography variant='caption'>
                                        Rationale
                                    </Typography>
                                    <Typography variant='body2'>
                                        {
                                            proposal?.attributes?.content
                                                ?.attributes?.prop_rationale
                                        }
                                    </Typography>
                                </Box>

                                {proposal?.attributes?.content?.attributes
                                    ?.proposal_links?.length > 0 && (
                                    <Box mt={4}>
                                        <Typography variant='caption'>
                                            Supporting links
                                        </Typography>

                                        <Box>
                                            {proposal?.attributes?.content?.attributes?.proposal_links?.map(
                                                (item, index) => (
                                                    <Button
                                                        key={index}
                                                        sx={{
                                                            marginRight: 2,
                                                            marginBottom: 2,
                                                        }}
                                                        startIcon={
                                                            <IconLink
                                                                width='18'
                                                                height='18'
                                                                fill={
                                                                    theme
                                                                        .palette
                                                                        .primary
                                                                        .main
                                                                }
                                                            />
                                                        }
                                                    >
                                                        {item?.prop_link_text}
                                                    </Button>
                                                )
                                            )}
                                        </Box>
                                    </Box>
                                )}
                                <Box
                                    mt={4}
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                >
                                    <IconButton
                                        data-testid='comment-count'
                                        disabled
                                    >
                                        <Badge
                                            badgeContent={
                                                proposal?.attributes
                                                    ?.prop_comments_number || 0
                                            }
                                            aria-label='proposal comments'
                                            showZero
                                            sx={{
                                                transform:
                                                    'translate(30px, -20px)',
                                                '& .MuiBadge-badge': {
                                                    color: 'white',
                                                    backgroundColor: (theme) =>
                                                        theme.palette
                                                            .badgeColors
                                                            .primary,
                                                },
                                            }}
                                        ></Badge>
                                        <IconChatAlt />
                                    </IconButton>
                                    <Box display={'flex'} gap={1}>
                                        {/* LIKE BUTTON */}
                                        <IconButton
                                            sx={{
                                                border: (theme) =>
                                                    `1px solid ${theme.palette.iconButton.outlineLightColor}`,
                                            }}
                                            data-testid='like-button'
                                            disabled={
                                                proposal?.attributes?.content
                                                    ?.attributes?.prop_submitted
                                                    ? true
                                                    : user
                                                      ? user?.user?.id?.toString() ===
                                                        proposal?.attributes?.user_id?.toString()
                                                          ? true
                                                          : userProposalVote
                                                            ? userProposalVote
                                                                  ?.attributes
                                                                  ?.vote_result ===
                                                              true
                                                                ? true
                                                                : false
                                                            : false
                                                      : true
                                            }
                                            onClick={() =>
                                                user &&
                                                userProposalVote?.attributes
                                                    ?.vote_result === true
                                                    ? null
                                                    : updateLikesOrDislikes({
                                                          like: true,
                                                      })
                                            }
                                        >
                                            <Badge
                                                badgeContent={
                                                    proposal?.attributes
                                                        ?.prop_likes || 0
                                                }
                                                data-testid='like-count'
                                                showZero
                                                aria-label='proposal likes'
                                                sx={{
                                                    transform:
                                                        'translate(30px, -20px)',
                                                    '& .MuiBadge-badge': {
                                                        color: 'white',
                                                        backgroundColor: (
                                                            theme
                                                        ) =>
                                                            theme.palette
                                                                .badgeColors
                                                                .secondary,
                                                    },
                                                }}
                                            ></Badge>
                                            <IconThumbUp
                                                fill={
                                                    user
                                                        ? userProposalVote
                                                            ? userProposalVote
                                                                  ?.attributes
                                                                  ?.vote_result ===
                                                              true
                                                                ? theme?.palette
                                                                      ?.primary
                                                                      ?.main
                                                                : theme?.palette
                                                                      ?.primary
                                                                      ?.icons
                                                                      ?.black
                                                            : theme?.palette
                                                                  ?.primary
                                                                  ?.icons?.black
                                                        : theme?.palette
                                                              ?.primary?.icons
                                                              ?.black
                                                }
                                            />
                                        </IconButton>
                                        {/* DISLIKE BUTTON */}
                                        <IconButton
                                            sx={{
                                                border: (theme) =>
                                                    `1px solid ${theme.palette.iconButton.outlineLightColor}`,
                                            }}
                                            data-testid='dislike-button'
                                            disabled={
                                                proposal?.attributes?.content
                                                    ?.attributes?.prop_submitted
                                                    ? true
                                                    : user
                                                      ? user?.user?.id?.toString() ===
                                                        proposal?.attributes?.user_id?.toString()
                                                          ? true
                                                          : userProposalVote
                                                            ? userProposalVote
                                                                  ?.attributes
                                                                  ?.vote_result ===
                                                              false
                                                                ? true
                                                                : false
                                                            : false
                                                      : true
                                            }
                                            onClick={() =>
                                                userProposalVote?.attributes
                                                    ?.vote_result === false
                                                    ? null
                                                    : updateLikesOrDislikes({
                                                          like: false,
                                                      })
                                            }
                                        >
                                            <Badge
                                                badgeContent={
                                                    proposal?.attributes
                                                        ?.prop_dislikes || 0
                                                }
                                                data-testid='dislike-count'
                                                showZero
                                                aria-label='proposal dislikes'
                                                sx={{
                                                    transform:
                                                        'translate(30px, -20px)',
                                                    '& .MuiBadge-badge': {
                                                        color: 'white',
                                                        backgroundColor: (
                                                            theme
                                                        ) =>
                                                            theme.palette
                                                                .badgeColors
                                                                .errorLight,
                                                    },
                                                }}
                                            ></Badge>
                                            <IconThumbDown
                                                fill={
                                                    user
                                                        ? userProposalVote
                                                            ? userProposalVote
                                                                  ?.attributes
                                                                  ?.vote_result ===
                                                              false
                                                                ? theme?.palette
                                                                      ?.primary
                                                                      ?.main
                                                                : theme?.palette
                                                                      ?.primary
                                                                      ?.icons
                                                                      ?.black
                                                            : theme?.palette
                                                                  ?.primary
                                                                  ?.icons?.black
                                                        : theme?.palette
                                                              ?.primary?.icons
                                                              ?.black
                                                }
                                            />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box
                        mt={4}
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Typography variant='h4' component='h3'>
                            Comments
                        </Typography>

                        <IconButton
                            sx={{
                                width: 40,
                                height: 40,
                            }}
                            onClick={() =>
                                proposal?.attributes?.prop_comments_number === 0
                                    ? null
                                    : setCommentsSortType((prev) =>
                                          prev === 'desc' ? 'asc' : 'desc'
                                      )
                            }
                            data-testid='sort-comments'
                        >
                            <IconSort
                                width='24'
                                height='24'
                                fill={theme.palette.primary.main}
                            />
                        </IconButton>
                    </Box>

                    <Box mt={4}>
                        <Poll
                            proposalID={id}
                            proposalUserId={proposal?.attributes?.user_id}
                            proposalAuthorUsername={
                                proposal?.attributes?.user_govtool_username
                            }
                            proposalSubmitted={
                                proposal?.attributes?.content?.attributes
                                    ?.prop_submitted
                            }
                        />
                    </Box>

                    {proposal?.attributes?.content?.attributes
                        ?.prop_submitted ? null : (
                        <Box mt={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant='subtitle1'>
                                        Submit a comment
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        margin='normal'
                                        variant='outlined'
                                        multiline={true}
                                        maxRows={5}
                                        helperText={
                                            <>
                                                <Typography variant='caption'>
                                                    * Symbols
                                                </Typography>
                                                <Typography
                                                    variant='caption'
                                                    sx={{
                                                        float: 'right',
                                                        mr: 2,
                                                        color: (theme) =>
                                                            newCommentText?.length ===
                                                                MAX_COMMENT_LENGTH &&
                                                            theme?.palette
                                                                ?.error?.main,
                                                    }}
                                                >
                                                    {`${
                                                        newCommentText?.length ||
                                                        0
                                                    }/${MAX_COMMENT_LENGTH}`}
                                                </Typography>
                                            </>
                                        }
                                        value={newCommentText || ''}
                                        onChange={(e) => handleChange(e)}
                                        inputProps={{
                                            maxLength: MAX_COMMENT_LENGTH,
                                            onKeyDown: handleKeyDown,
                                            spellCheck: 'false',
                                            autoCorrect: 'off',
                                            autoCapitalize: 'none',
                                            autoComplete: 'off',
                                        }}
                                        data-testid='comment-input'
                                    />

                                    <Box
                                        mt={2}
                                        display='flex'
                                        justifyContent={
                                            user ? 'flex-end' : 'space-between'
                                        }
                                        flexDirection={{
                                            xs: 'column',
                                            sm: 'row',
                                        }}
                                        gap={2}
                                    >
                                        {!user && (
                                            <Typography variant='body2'>
                                                Connect wallet to submit a
                                                comment or create proposal
                                            </Typography>
                                        )}

                                        <Button
                                            variant='contained'
                                            onClick={handleCreateComment}
                                            disabled={
                                                !newCommentText ||
                                                !user?.user?.govtool_username
                                            }
                                            endIcon={
                                                <IconReply
                                                    height={18}
                                                    width={18}
                                                    fill={
                                                        !newCommentText ||
                                                        !user?.user
                                                            ?.govtool_username
                                                            ? 'rgba(0,0,0, 0.26)'
                                                            : 'white'
                                                    }
                                                />
                                            }
                                            data-testid='comment-button'
                                        >
                                            Comment
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                    {proposal?.attributes?.prop_comments_number === 0 ? (
                        <Card
                            variant='outlined'
                            sx={{
                                backgroundColor: alpha('#FFFFFF', 0.3),
                                my: 3,
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
                                        No Comments yet
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        color='text.black'
                                    >
                                        Be the first to share your thoughts on
                                        this proposal.
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    ) : null}

                    {commentsList?.map((comment, index) => (
                        <Box mt={4} key={index}>
                            <CommentCard
                                comment={comment}
                                proposal={proposal}
                            />
                        </Box>
                    ))}
                    {commentsCurrentPage < commentsPageCount && (
                        <Box
                            marginY={2}
                            display={'flex'}
                            justifyContent={'flex-end'}
                        >
                            <Button
                                onClick={() => {
                                    fetchComments(commentsCurrentPage + 1);
                                    setCommentsCurrentPage((prev) => prev + 1);
                                }}
                            >
                                Load more comments
                            </Button>
                        </Box>
                    )}

                    <Modal
                        open={openDeleteModal}
                        onClose={handleCloseDeleteModal}
                        data-testid='delete-proposal-modal'
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: {
                                    xs: '90%',
                                    sm: '50%',
                                    md: '30%',
                                },
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: '20px',
                            }}
                        >
                            <Box
                                pt={2}
                                pl={2}
                                pr={2}
                                pb={1}
                                borderBottom={1}
                                borderColor={(theme) =>
                                    theme.palette.border.lightGray
                                }
                            >
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    justifyContent='space-between'
                                    alignItems={'center'}
                                >
                                    <Typography
                                        id='modal-modal-title'
                                        variant='h6'
                                        component='h2'
                                    >
                                        Do you want to delete your proposal?
                                    </Typography>
                                    <IconButton
                                        onClick={handleCloseDeleteModal}
                                    >
                                        <IconX width='24px' height='24px' />
                                    </IconButton>
                                </Box>
                                <Typography
                                    id='modal-modal-description'
                                    mt={2}
                                    color={(theme) => theme.palette.text.grey}
                                >
                                    A dialog is a type of modal window that
                                    appears in front of app content to provide
                                    critical information, or prompt for a
                                    decision to be made.
                                </Typography>
                            </Box>
                            <Box
                                display='flex'
                                flexDirection='column'
                                padding={2}
                                gap={2}
                            >
                                <Button
                                    variant='contained'
                                    fullWidth
                                    sx={{
                                        borderRadius: '20px',
                                    }}
                                    onClick={handleCloseDeleteModal}
                                    data-testid='delete-proposal-no-button'
                                >
                                    I don't want to delete
                                </Button>
                                <Button
                                    variant='outlined'
                                    fullWidth
                                    sx={{
                                        borderRadius: '20px',
                                    }}
                                    onClick={handleDeleteProposal}
                                    data-testid='delete-proposal-yes-button'
                                >
                                    Yes, delete my proposal completely
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    <ProposalSubmissionDialog
                        proposal={proposal}
                        openEditDialog={openGASubmissionDialog}
                        handleCloseSubmissionDialog={() =>
                            setOpenGASubmissionDialog(false)
                        }
                    />
                </Box>
            )}
        </>
    );
};

export default SingleGovernanceAction;
