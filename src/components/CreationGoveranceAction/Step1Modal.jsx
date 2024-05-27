import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/context';

const style = {
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
};

const ChildModal = ({
    isContinueDisabled,
    handleSaveDraft,
    setProposalData,
    handleClose,
}) => {
    const { locale } = useAppContext();
    const navigate = useNavigate();
    const [openChildModal, setOpenChildModal] = useState(false);
    const handleOpenChildModal = () => {
        setOpenChildModal(true);
    };
    const handleCloseChildModal = () => {
        setOpenChildModal(false);
    };

    return (
        <Box>
            <Box display='flex' flexDirection='column' padding={2} gap={2}>
                <Button
                    variant='contained'
                    fullWidth
                    sx={{
                        borderRadius: '20px',
                    }}
                    onClick={handleClose}
                >
                    I don't want to cancel
                </Button>
                <Button
                    variant='outlined'
                    fullWidth
                    sx={{
                        borderRadius: '20px',
                    }}
                    disabled={isContinueDisabled}
                    onClick={() => {
                        handleSaveDraft();
                        handleOpenChildModal();
                    }}
                >
                    Yes, cancel & save it as draft
                </Button>
                <Button
                    variant='text'
                    fullWidth
                    sx={{
                        borderRadius: '20px',
                    }}
                    onClick={() => {
                        setProposalData({});
                        handleOpenChildModal();
                    }}
                >
                    Yes, cancel and don't save it
                </Button>
            </Box>
            <Modal open={openChildModal} onClose={handleCloseChildModal}>
                <Box
                    sx={style}
                    display='flex'
                    flexDirection='column'
                    padding={2}
                    gap={2}
                >
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                    >
                        <Typography
                            id='modal-modal-title'
                            variant='h6'
                            component='h2'
                        >
                            Proposal successfully canceled
                        </Typography>
                    </Box>
                    <Button
                        variant='contained'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={() => navigate(`/proposed-governance-actions`)}
                    >
                        Close and go to Proposal List
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

const Step1Modal = ({
    open,
    handleClose,
    isContinueDisabled,
    setProposalData,
    handleSaveDraft,
}) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box
                    pt={2}
                    pl={2}
                    pr={2}
                    pb={1}
                    borderBottom={1}
                    borderColor={(theme) => theme.palette.border.lightGray}
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
                            Dialog Title
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <IconX width='24px' height='24px' />
                        </IconButton>
                    </Box>
                    <Typography
                        id='modal-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.grey}
                    >
                        A dialog is a type of modal window that appears in front
                        of app content to provide critical information, or
                        prompt for a decision to be made.
                    </Typography>
                </Box>
                <ChildModal
                    isContinueDisabled={isContinueDisabled}
                    setProposalData={setProposalData}
                    handleSaveDraft={handleSaveDraft}
                    handleClose={handleClose}
                />
            </Box>
        </Modal>
    );
};

export default Step1Modal;
