import { defineStore } from 'pinia'
import { useAPI } from '@/api/useAPI'

export const useNotesStore = defineStore({
    id: 'notes',
    state: () => ({
        notes: null
    }),

    actions: {
        async setNotes() {
            const response = await useAPI(`notes`);
            this.notes = response
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
            //     this.notes[noteID].reaction = reactionID;(response, status)
            // }
        },
        async setStatus(noteID, status) {
            const response = await useAPI(`noteStatus`, { "status": `${status}` }, noteID)
            console.log(response, status)
            if (response.success) {
                if (status = 'deleted') {
                    console.log('initial data', this.notes);
                    this.notes = this.notes.filter(note => { return note.id !== noteID })
                    console.log('filtered data', this.notes);
                }
            }
        }
    },
    persist: {
        enabled: true
    }
})
