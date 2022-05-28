const token = localStorage.getItem('ppTkn')

export const apiBaseURL = process.env.REACT_APP_API_BASE_URL || 'https://pushpin.libbychapman.com/api';

export const config = {
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'authorization': `Bearer ${token}`
    }
}

export default { apiBaseURL, config }
