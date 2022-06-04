import { reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useAPI } from '@/api/useAPI'

const authData = reactive({
    auth: null,
    info: null
})

export function useAuth() {
    // watch(() => counterData.count, (newCount, oldCount) => {
    //     console.log('new, old', newCount, oldCount)
    //     if (newCount === 20) {
    //         alert('Way to go! You made it to 20!!')
    //     }
    // })

    // const oddOrEven = computed(() => {
    //     if (counterData.count % 2 === 0) return 'even'
    //     return 'odd'
    // })

    const performLogin = async (data) => {
        const response = await useAPI(`login`, data);

        if (response.tokenInfo) {
            authData.auth = response.tokenInfo;
            authData.info = response.user;
        }
    }

    const getToken = () => {
        return (authData.auth && authData.auth.token) ? authData.auth.token : null
    }

    // const decreaseCounter = amount => {
    //     counterData.count -= amount
    // }

    // onMounted(() => {
    //     console.log('Do stuff related to Counter')
    // })

    return {
        performLogin,
        getToken
    }
}