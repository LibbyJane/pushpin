import axios from 'axios'
import { apiBaseURL } from './config';

const instance = axios.create({
    baseURL: apiBaseURL,
    headers: {
        'content-type': 'application/json',
        'api-key': process.env.RAPIDAPI_KEY
    }
});

export default {
    login: (email, password) =>
        instance({
            'method': 'POST',
            'url': '/login',
            'data': { email, password }
        })
}

export { login }


// getServerTime: async function () {
//     const url = `clock/serverdatetime`;
//     const result = await helpers.fetch(url, 'GET');
//     return result;
// },

// getSaleRegistration: async function (saleId) {
//     const url = `account/registration/${saleId}`;
//     const result = await helpers.fetch(url, 'GET');
//     return result;
// },

// watchLot: async function (saleId, lotId) {
//     const url = `watchlist/${saleId}/${lotId}`;
//     const result = await helpers.fetch(url, 'PUT', null, null, true);
//     return result;
// },

// unwatchLot: async function (saleId, lotId) {
//     const url = `watchlist/${saleId}/${lotId}`;
//     const result = await helpers.fetch(url, 'DELETE', null, null, true);
//     return result;
// },

// placeBid: async function (saleId, lotId, bidAmount) {
//     // console.log('place bid', saleId, lotId, bidAmount);
//     const url = `sales/${saleId}/lots/${lotId}/bids`;
//     const data = { "bidAmount": parseInt(bidAmount) };
//     const result = await helpers.fetch(url, 'POST', data, 'blob');
//     // console.log('placebid result', result);
//     return result;
// },

// markAllNotificationsAsRead: async function () {
//     const url = `notifications`;
//     const result = await helpers.fetch(url, 'PATCH');
//     // console.log('markAllNotificationsAsRead result', result);
//     return result;
// },