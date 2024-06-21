import { format } from 'date-fns';

export const formatIsoDate = (isoDate) => {
    if (!isoDate) return '';

    return format(new Date(isoDate), 'd MMMM yyyy');
};

export const formatIsoTime = (isoDate) => {
    if (!isoDate) return '';

    return format(new Date(isoDate), 'hh:mm aa');
};

export const formatPollDateDisplay = (dateString) => {
    if (!dateString) return '';

    return `${format(new Date(dateString), 'dd/MM/yyyy - p')} UTC`;
};

export const saveDataInSession = (key, value) => {
    const data = { value, timestamp: new Date().getTime() };
    sessionStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromSession = (key) => {
    const data = JSON.parse(sessionStorage.getItem(key));
    if (data) {
        return data.value;
    } else {
        return null;
    }
};

export const clearSession = () => {
    sessionStorage.removeItem('pdfUserJwt');
};

export const utf8ToHex = (str) => {
    return Array.from(str)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
};