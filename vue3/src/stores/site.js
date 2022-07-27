import { defineStore } from 'pinia'
import { useAPI } from '@/api/useAPI';

export const useSiteStore = defineStore({
    id: 'site',
    state: () => ({
        pageTitle: "Welcome",
        siteUsers: null,
        matchedUsers: null,
    }),
    getters: {
        getPageTitle(state) {
            return state.pageTitle
        }
    },
    actions: {
        async setSiteUsers() {
            const response = await useAPI(`users`);
            console.log('friends response', response);
            this.siteUsers = response;
        }
    }
})
