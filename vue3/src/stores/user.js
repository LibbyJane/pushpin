import { nextTick } from 'vue';
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
            const now = Date.now();

            if (localStorage.getItem('ppTkn') && localStorage.getItem('ppSessionExpiry') && (localStorage.getItem('ppSessionExpiry') > now)) {
                console.log('valid')
            }
        },

        async performLogin(data) {
            const response = await useAPI(`login`, data);
            console.log('response', response);

            if (response.tokenInfo) {
                this.updateAuth(response.tokenInfo);
                this.info = response.user;
                this.performSetFriends()

                router.replace('/');
            } else {
                return response
            }
        },


        async performRegister(data) {
            const response = await useAPI(`register`, data);

            if (response.tokenInfo) {
                this.updateAuth(response.tokenInfo);
                this.info = response.user;

                router.replace('/');
            }
            else {
                console.log('reg response: ', response);
            }
        },


        async performSetFriends() {
            const response = await useAPI(`users`);
            console.log('friends', response);
            this.friends = response;
        },

        async performLogout() {

            if (this.auth.token) {
                const response = await useAPI(`logout`);
                this.reset();
                router.replace('/login');
                // if (response.success) {
                //     this.reset();\\\\
                // }
            }
        },


        reset() {
            this.$reset();
            localStorage.removeItem('ppTkn');
            localStorage.removeItem('ppSessionExpiry');

        },

        updateAuth(data) {
            this.auth = data
            localStorage.setItem('ppTkn', data.token)
            localStorage.setItem('ppSessionExpiry', data.expiresAt)
        },

        async updatePhoto(data) {
            console.log('update user photo', data);
            const response = await useAPI(`profilePhoto`, { "profilePhoto": data });

            if (response.success) {
                this.info.imageURL = null;
                await nextTick();
                this.info.imageURL = response.imageUrl;
            }
        },

        async generateInvitationCode() {
            const response = await useAPI(`invite`);
            return response;
        },

        async getInvitationSender(id) {
            console.log('invitation id', id);
            const response = await useAPI(`invitationIssuer`, null, id);

            console.log('response', response);

            return response;
        },


    },
    persist: {
        enabled: true
    }
})
