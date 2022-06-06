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

        async sendNote(noteData, imageData) {
            const response = await useAPI(`note`, noteData);

            if (response.success && imageData) {
                const imageResponse = await useAPI(`notePhoto`, { "notePhoto": imageData }, response.note.id)
                return imageResponse;
            } else {
                return response;
            }
        },

        async setReaction(noteID, reactionID) {
            const response = await useAPI(`noteReaction`, { "reaction": `${reactionID}` }, noteID)
            // if (response.success) {
            //     this.data[noteID].reaction = reactionID;(response, status)
            // }
        },
        async setStatus(noteID, status) {
            const response = await useAPI(`noteStatus`, { "status": `${status}` }, noteID)
            console.log(response, status)
            // if (response.success) {
            //     this.data[noteID].status = status;
            // }
        },
    },
    persist: {
        enabled: true
    }
})
