import { loginUser, getLoggedInUserInfo } from '../lib/api';
import { format } from 'date-fns';
import { saveDataInSession, getDataFromSession, utf8ToHex } from '../lib/utils';

export const loginUserToApp = async ({
    wallet,
    setUser,
    setOpenUsernameModal,
    callBackFn,
    globalWrapper = false,
}) => {
    try {
        if (getDataFromSession('pdfUserJwt')) {
            const loggedInUser = await getLoggedInUserInfo();
            setUser({
                user: {
                    ...loggedInUser,
                },
            });

            if (loggedInUser && !loggedInUser?.govtool_username) {
                setOpenUsernameModal({
                    open: true,
                    callBackFn: callBackFn
                        ? () => callBackFn(loggedInUser)
                        : () => {},
                });
            } else {
                if (callBackFn) {
                    callBackFn(loggedInUser);
                }
            }
        } else {
            if (!globalWrapper) {
                const changeAddrHex = await wallet?.address;
                const messageUtf = `Please sign this message to verify your identity at ${format(
                    new Date(),
                    'd MMMM yyyy HH:mm:ss'
                )}`;
                const messageHex = utf8ToHex(messageUtf);

                const signedData = await wallet.signData(
                    changeAddrHex,
                    messageHex
                );

                const userResponse = await loginUser({
                    identifier: changeAddrHex,
                    signedData: signedData,
                });

                if (!userResponse) return;
                saveDataInSession('pdfUserJwt', userResponse?.jwt);
                setUser(userResponse);

                if (userResponse && !userResponse?.user?.govtool_username) {
                    setOpenUsernameModal({
                        open: true,
                        callBackFn: callBackFn
                            ? () => callBackFn(userResponse?.user)
                            : () => {},
                    });
                } else {
                    if (callBackFn) {
                        callBackFn(userResponse?.user);
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};
