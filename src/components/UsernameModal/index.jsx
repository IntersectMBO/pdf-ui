import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
} from '@mui/material';
import { IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useState } from 'react';
import { updateUser } from '../../lib/api';
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

const UsernameModal = ({ open, handleClose: close }) => {
    const { setUser } = useAppContext();
    const [username, setUsername] = useState('');
    const [step, setStep] = useState(1);

    const handleClose = () => {
        close();
        setStep(1);
    };

    const handleNext = async () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            const updatedUser = await updateUser({
                govtoolUsername: username,
            });

            if (!updatedUser) return;

            setUser((currentUser) => ({
                ...currentUser,
                user: updatedUser,
            }));

            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Box p={2}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6' component='h2'>
                                Hey, setup your username
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <IconX width='24px' height='24px' />
                            </IconButton>
                        </Box>

                        <Typography
                            variant='body2'
                            sx={{
                                mt: 2,
                                mb: 2,
                            }}
                            color={(theme) => theme.palette.text.grey}
                        >
                            Username cannot be changed in the Future. Some
                            subtext why it is important goes here.
                        </Typography>

                        <TextField
                            label='Username'
                            variant='outlined'
                            sx={{
                                mb: 2,
                            }}
                            fullWidth
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Button
                            variant='contained'
                            fullWidth
                            disabled={!username}
                            onClick={handleNext}
                        >
                            Proceed with this username
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box p={2}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6' component='h2'>
                                Are you sure you want to use "{username}"?
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <IconX width='24px' height='24px' />
                            </IconButton>
                        </Box>
                        <Typography
                            variant='body2'
                            sx={{
                                mt: 2,
                                mb: 2,
                            }}
                            color={(theme) => theme.palette.text.grey}
                        >
                            Username cannot be changed in the future. Please
                            confirm it’s correct.
                        </Typography>
                        <TextField
                            label='Username'
                            variant='outlined'
                            sx={{
                                mb: 2,
                            }}
                            fullWidth
                            value={username || ''}
                            disabled
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={handleNext}
                            >
                                Proceed with this username
                            </Button>
                            <Button
                                variant='text'
                                fullWidth
                                onClick={handleBack}
                            >
                                No, Change
                            </Button>
                        </Box>
                    </Box>
                );
            case 3:
                return (
                    <>
                        <Box
                            p={2}
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
                                <Typography variant='h6' component='h2'>
                                    Username submitted!
                                </Typography>
                                <IconButton onClick={handleClose}>
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box m={2}>
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                        </Box>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>{renderStep()}</Box>
        </Modal>
    );
};

export default UsernameModal;