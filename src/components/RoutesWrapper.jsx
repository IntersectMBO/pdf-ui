'use client';

import { Route, Routes } from 'react-router-dom';
import { useAppContext } from '../context/context';
import {
    CreateGovernanceAction,
    ProposedGovernanceActions,
    SingleGovernanceAction,
} from '../pages';

const RoutesWrapper = ({ locale }) => {
    const { user } = useAppContext();

    return (
        <Routes>
            <Route
                path={`/proposed-governance-actions`}
                element={<ProposedGovernanceActions />}
            />
            <Route
                path={`/proposed-governance-actions/:id`}
                element={<SingleGovernanceAction />}
            />
            <Route
                path={`/proposed-governance-actions/create-governance-action`}
                element={
                    // user ? (
                <CreateGovernanceAction />
                    // ) : (
                    //     <Navigate to={`/proposed-governance-actions`} />
                    // )
                }
            />
        </Routes>
    );
};

export default RoutesWrapper;
