'use client';

import { Route, Routes } from 'react-router-dom';
import {
    CreateGovernanceAction,
    ProposedGovernanceActions,
    SingleGovernanceAction,
} from '../pages';

const RoutesWrapper = () => {
    return (
        <Routes>
            <Route
                path={`/proposal_discussion`}
                element={<ProposedGovernanceActions />}
            />
            <Route
                path={`/proposal_discussion/:id`}
                element={<SingleGovernanceAction />}
            />
            <Route
                path={`/proposal_discussion/create-governance-action`}
                element={
                    // user ? (
                    <CreateGovernanceAction />
                    // ) : (
                    //     <Navigate to={`/proposal_discussion`} />
                    // )
                }
            />
        </Routes>
    );
};

export default RoutesWrapper;
