import { useEffect } from 'react';
import { RoutesWrapper } from '../components';
import { useAppContext } from '../context/context';

const GlobalWrapper = ({ ...props }) => {
    const { setWalletAPI, setLocale } = useAppContext();
    const {
        walletAPI: GovToolAssemblyWalletAPI,
        locale: GovToolAssemblyLocale,
    } = props;

    useEffect(() => {
        setWalletAPI(GovToolAssemblyWalletAPI);
    }, [GovToolAssemblyWalletAPI]);
    useEffect(() => {
        setLocale(GovToolAssemblyLocale);
    }, [GovToolAssemblyLocale]);
    return <RoutesWrapper locale={GovToolAssemblyLocale} />;
};

export default GlobalWrapper;
