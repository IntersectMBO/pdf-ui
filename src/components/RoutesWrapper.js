import { Route, Routes } from 'react-router-dom';
import { ProposedGovernanceActions, SingleGovernanceAction } from '../pages';

const RoutesWrapper = ({ locale }) => {
    return (
        <Routes>
            <Route
                path={`/${locale}/proposed-governance-actions`}
                element={<ProposedGovernanceActions />}
            />
            <Route
                path={`/${locale}/proposed-governance-actions/:id`}
                element={<SingleGovernanceAction />}
            />
        </Routes>
    );
};

export default RoutesWrapper;
