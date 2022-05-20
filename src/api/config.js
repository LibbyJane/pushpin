const token = localStorage.getItem('ppTkn')

export const apiBaseURL = `https://localhost:4000`
export const config = {
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'authorization': `Bearer ${token}`
    }
}

export default { apiBaseURL, config }
