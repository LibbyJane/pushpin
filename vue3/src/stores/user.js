import { nextTick } from 'vue';
import { defineStore } from 'pinia';
import { useAPI } from '@/api/useAPI';
import router from '@/router';

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        auth: null,
        info: null,
        friends: null,
    }),
    getters: {
        getAuth(state) {
            if (state.auth && state.auth.token && state.auth.expiresAt > Date.now()) {
                return state.auth.token;
            }
        }
    },
    actions: {
        init() {
            const now = Date.now();

            if (
                localStorage.getItem('ppTkn') &&
                localStorage.getItem('ppSessionExpiry') &&
                localStorage.getItem('ppSessionExpiry') > now
            ) {
                console.log('valid');
            }
        },

        async performLogin(data) {
            const response = await useAPI(`login`, data);
            console.log('response', response);

            if (response && response.tokenInfo) {
                this.initUserData(response);
                router.replace('/');
            } else {
                return response;
            }
        },

        async performSignUp(data, invitationCode) {
            const response = await useAPI(`register`, data);

            if (response.tokenInfo) {
                if (invitationCode) {
                    let friend = await this.acceptInvitation(invitationCode);
                    console.log('friended', friend);
                }

                this.initUserData(response);
                router.replace('/');
            } else {
                return response;
            }
        },

        initUserData(data) {
            this.info = data.user;
            this.updateAuth(data.tokenInfo);
            this.performSetFriends();
        },

        updateAuth(data) {
            this.auth = data;
            localStorage.setItem('ppTkn', data.token);
            localStorage.setItem('ppSessionExpiry', data.expiresAt);
        },

        async performSetFriends() {
            console.log('performSetFriends');
            const response = await useAPI(`friends`);
            console.log('friends response', response);
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

        async updatePhoto(data) {
            console.log('update user photo', data);
            const response = await useAPI(`profilePhoto`, { profilePhoto: data });

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

        async inviteUser(userID) {
            const response = await useAPI(`invite`, { recipientId: userID });
            return response;
        },

        async acceptInvitation(invitationCode) {
            console.log('accept invitiation, ', invitationCode);
            const response = await useAPI(`acceptInvitation`, null, invitationCode);

            console.log('acceptInvitation response', response);

            return response;
        },

        async invitationSender(id) {
            const response = await useAPI(`invitationIssuer`, null, id);
            console.log('invitationSender response', response);

            return response;
        },

        async getInvitations() {
            console.log('get invitations');
            const response = await useAPI(`invitationsReceived`);

            console.log('invitationsReceived', response);

            return response;
        },

        reset() {
            this.$reset();
            localStorage.removeItem('ppTkn');
            localStorage.removeItem('ppSessionExpiry');
        },
    },
    persist: {
        enabled: true,
    },
});
