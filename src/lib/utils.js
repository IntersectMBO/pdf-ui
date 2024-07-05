import { format } from 'date-fns';

export const URL_REGEX =
    /^(?:(?:https?:\/\/)?(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(?:\/[^\s]*)?)|(?:ipfs:\/\/[a-f0-9]+(?:\/[a-zA-Z0-9_]+)*)$|^$/;

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

export function isValidURLFormat(str) {
    if (!str.length) return false;
    return URL_REGEX.test(str);
}

export function isValidURLLength(s) {
    if (s.length > 128) {
        return 'Url must be less than 128 bytes';
    }

    const encoder = new TextEncoder();
    const byteLength = encoder.encode(s).length;

    return byteLength <= 128 ? true : 'Url must be less than 128 bytes';
}

export const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
};