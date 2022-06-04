import { defineStore } from 'pinia'
import { useAPI } from '@/api/useAPI'
import router from '@/router'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        auth: null,
        info: null,
        friends: null
    }),
    getters: {
        getAuth(state) {
            if (state.auth && state.auth.token && state.auth.expiresAt > Date.now()) {
                return state.auth.token
            }
        },
        getInfo(state) {
            return state.info
        },

        getFriends(state) {
            return state.friends
        }
    },
    actions: {
        init() {
            console.log('init');
            const now = Date.now();
            console.log('init', now, localStorage.getItem('ppSessionExpiry'));
            if (localStorage.getItem('ppTkn') && localStorage.getItem('ppSessionExpiry') && (localStorage.getItem('ppSessionExpiry') > now)) {
                console.log('valid')
            }
        },

        async performLogin(data) {
            const response = await useAPI(`login`, data);

            if (response.tokenInfo) {
                this.updateAuth(response.tokenInfo);
                this.info = response.user;
                this.performSetFriends()

                router.replace('/');
            }
        },

        async performSetFriends() {
            const response = await useAPI(`users`);
            console.log('friends', response);
            this.friends = response;
        },

        async performLogout() {
            if (this.auth.token) {
                console.log('token?', this.auth.token)
                const response = await useAPI(`logout`);
                console.log('response', response)

                // if (response.success) {
                //     this.reset();
                // }
            }
        },


        reset() {
            this.$reset()
            localStorage.removeItem('ppTkn');
            localStorage.removeItem('ppSessionExpiry');
            router.replace('/login');
        },

        updateAuth(data) {
            this.auth = data
            localStorage.setItem('ppTkn', data.token)
            localStorage.setItem('ppSessionExpiry', data.expiresAt)
        },

        updateInfo(data) {
            this.info = data
        }
    },
    persist: {
        enabled: true
    }
})
