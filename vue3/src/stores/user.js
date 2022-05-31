import { defineStore } from 'pinia'
import { useAPI } from '@/api/useAPI'

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        auth: null,
        info: null
    }),
    getters: {
        getAuth(state) {
            return state.auth
        },
        getInfo(state) {
            return state.info
        }
    },
    actions: {
        async performLogin(data) {
            const response = await useAPI(`login`, data);

            if (response.tokenInfo) {
                this.auth = response.tokenInfo;
                this.info = response.user;
            }
        },
        updateAuth(data) {
            this.auth = data
        },
        updateInfo(data) {
            this.info = data
        }
    },
    persist: {
        enabled: true
    }
})
