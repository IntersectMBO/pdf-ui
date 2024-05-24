import { Route, Routes } from 'react-router-dom';
import {
    ProposedGovernanceActions,
    SingleGovernanceAction,
    CreateGovernanceAction,
} from '../pages';

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
            <Route
                path={`/${locale}/proposed-governance-actions/create-goverance-action`}
                element={<CreateGovernanceAction />}
            />
        </Routes>
    );
};

export default RoutesWrapper;
