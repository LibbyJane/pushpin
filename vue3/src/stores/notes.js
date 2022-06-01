import { defineStore } from 'pinia'
import { useAPI } from '@/api/useAPI'

export const useNotesStore = defineStore({
    id: 'notes',
    state: () => ({
        data: null
    }),
    getters: {
        getNotes(state) {
            return state.data
        }
    },
    actions: {
        async setNotes() {
            const response = await useAPI(`notes`);
            this.data = response
        },
        async setReaction(noteID, reactionID) {
            const response = await useAPI(`noteReaction`, { "reaction": `${reactionID}` }, noteID)
            // if (response.success) {
            //     this.data[noteID].reaction = reactionID;
            // }
        },
        async setStatus(noteID, status) {
            const response = await useAPI(`noteStatus`, { "status": `${status}` }, noteID)
            // if (response.success) {
            //     this.data[noteID].status = status;
            // }
        }
    },
    persist: {
        enabled: true
    }
})
