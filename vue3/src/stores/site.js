import { defineStore } from 'pinia'

export const useSiteStore = defineStore({
    id: 'site',
    state: () => ({
        pageTitle: "Welcome"
    }),
    // getters: {
    //     getPageTitle(state) {
    //         console.log('what dis', state.pageTitle, typeof state.pageTitle);
    //         return state.pageTitle
    //     }
    // },
    // actions: {
    //     async setPageTitle(string) {
    //         state.pageTitle = string;

    //         await nextTick();
    //         state.pageTitle = string;
    //     },
    // }
})
