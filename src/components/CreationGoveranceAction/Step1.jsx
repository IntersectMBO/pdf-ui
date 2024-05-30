import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { ProposalsList } from '..';
import { useRouter } from '@/navigation';

const Step1 = ({ setStep, setProposalData }) => {
    const router = useRouter();

    return (
        <Box>
            <Card
                variant='outlined'
                sx={{
                    boxShadow: 1,
                    borderRadius: '20px',
                    mb: 2,
                    ml: 2,
                    mr: 2,
                    maxWidth: '910px',
                }}
            >
                <CardContent
                    sx={{
                        mb: 2,
                        ml: {
                            xs: 2,
                            md: 20,
                        },
                        mr: {
                            xs: 2,
                            md: 20,
                        },
                    }}
                >
                    <Box mb={2} mt={2}>
                        <Typography
                            variant='h4'
                            align='center'
                            textAlign='center'
                        >
                            Step to submit a Governance action
                        </Typography>
                    </Box>

                    <Box
                        gap={2}
                        textAlign='justify'
                        color={(theme) => theme.palette.text.grey}
                    >
                        <ul>
                            <li>
                                <Typography variant='body1' gutterBottom>
                                    Before submitting a Governance Action on
                                    chain you need to submit a Proposal.
                                </Typography>

                                <Typography
                                    variant='body1'
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    This allows you to get feedback from the
                                    community to refine and improve your
                                    proposal, increasing the chances of your
                                    Governance Action getting approved, and also
                                    building up supporting context in the form
                                    of metadata.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant='body1' gutterBottom>
                                    Once you are happy with your proposal you
                                    can open a poll to check ‘Is this proposal
                                    ready to be submitted on chain?’
                                </Typography>
                            </li>
                            <li>
                                <Typography variant='body1' gutterBottom>
                                    If you get support on the poll you are ready
                                    to submit your proposal on chain as a
                                    Governance Action to get voted on.
                                </Typography>
                            </li>
                        </ul>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                        }}
                    >
                        <Button
                            variant='outlined'
                            sx={{ borderRadius: '20px' }}
                            onClick={() => router.push('/proposal_discussion')}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            sx={{ borderRadius: '20px' }}
                            onClick={() => setStep(2)}
                        >
                            Continue
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Box mt={4}>
                <ProposalsList
                    isDraft={true}
                    startEdittinButtonClick={(proposal) => {
                        setStep(2);
                        setProposalData(
                            proposal?.attributes?.content?.attributes
                        );
                    }}
                />
            </Box>
        </Box>
    );
};

export default Step1;
