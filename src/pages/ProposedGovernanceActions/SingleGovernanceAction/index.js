import { useParams } from 'react-router-dom';

const SingleGovernanceAction = () => {
    const { id } = useParams();
    return <div>SingleGovernanceAction {id}</div>;
};

export default SingleGovernanceAction;
