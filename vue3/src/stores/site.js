import { defineStore } from 'pinia'

export const useSiteStore = defineStore({
    id: 'site',
    state: () => ({
        pageTitle: "Welcome"
    }),
    getters: {
        getPageTitle(state) {
            return state.pageTitle
        }
    }
})
