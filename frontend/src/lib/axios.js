import axios from 'axios';

const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === '127.0.0.1') {
            return 'http://127.0.0.1:8000';
        }
    }
    return 'http://localhost:8000';
};

export const Clientaxios = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,           
    withXSRFToken: true,             
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

