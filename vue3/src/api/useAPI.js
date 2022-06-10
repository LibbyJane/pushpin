import axios from "axios"
import { apiBaseURL } from '@/api/config';
import { useUserStore } from '@/stores/user';
import router from '@/router'

const endpoints = {
    register: {
        uri: `register`,
        method: 'POST'
    },

    login: {
        uri: `login`,
        method: 'POST'
    },

    logout: {
        uri: `logout`,
        method: 'GET'
    },

    users: {
        uri: `users`,
        method: 'GET'
    },

    notes: {
        uri: `notes`,
        method: 'GET'
    },

    note: {
        uri: `note`,
        method: 'POST'
    },

    notePhoto: {
        uri: `upload/note_photo/`,
        method: 'PATCH'
    },

    noteStatus: {
        uri: `note/update_status/`,
        method: 'PATCH'
    },

    noteReaction: {
        uri: `note/update_reaction/`,
        method: 'PATCH'
    },

    reactions: {
        uri: `note/reactions/`,
        method: 'GET'
    },

    profilePhoto: {
        uri: `upload/profile_photo`,
        method: 'POST'
    },

    invite: {
        uri: `invite`,
        method: 'POST'
    },

    invitationIssuer: {
        uri: `user/invite/`,
        method: 'GET'
    }
}

export async function useAPI(endpoint, data, endpointID) {
    console.log('endpoint uri, method, data, endpointID', endpoint, data, endpointID)
    const userStore = useUserStore();
    const token = userStore && userStore.getAuth ? userStore.getAuth : null;
    // console.log('token', token)

    if (endpoint && endpoints[endpoint]) {
        console.log('a', endpoints[endpoint]);
        let config = {
            headers: {},
            baseURL: apiBaseURL,
            url: endpoints[endpoint].uri,
            method: endpoints[endpoint].method
        }

        if (config.url.indexOf('upload') > -1) {
            config.headers['content-type'] = 'multipart/form-data';
        }

        if (data) {
            config.data = data
        }

        if (endpointID) {
            config.url = config.url + `${endpointID}`
        }

        if (token) {
            config.headers.authorization = `Bearer ${token}`
        }

        console.log('final config', config);

        try {
            const response = await axios(config)
            // console.log('response', response)
            return response.data

        } catch (error) {
            console.log('error', error)
            // console.log("There was a problem.", error)
            if (error.response.status === 403) {
                console.log('bad token, logout')

                userStore.performLogout;
            }

            // return error.response.data.errors[0]
        }

        // return () => {
        //     ourRequest.cancel()
        // }
    }

}

export default useAPI
