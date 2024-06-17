import React from 'react';

import { Modal, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DraftSuccessfulModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    return (
        <Modal
            open={open}
            onClose={onClose}
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
                    borderColor={(theme) => theme.palette.border.lightGray}
                >
                    <Typography
                        id='modal-modal-title'
                        variant='h6'
                        component='h2'
                    >
                        Draft successfully saved
                    </Typography>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='contained'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={() => {
                            onClose();
                            navigate(`/proposal_discussion`);
                        }}
                        data-testid='delete-proposal-yes-button'
                    >
                        Close and go to Proposal List
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DraftSuccessfulModal;
