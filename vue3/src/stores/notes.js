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
            for (let i = 0; i < response.length; i++) {
                response[i].giphyMetadata = JSON.parse(response[i].giphyMetadata);
                if (response[i].style === 'polaroid') {
                    response[i].style === 'instant-photo'
                }
            }
            this.notes = response;
        },

        async sendNote(noteData, imageData) {
            noteData.giphyMetadata = JSON.stringify(noteData.giphyMetadata);
            //noteData.color = 'var(--white)';

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

            if (response.success) {

                if (status === 'deleted') {
                    this.notes = this.notes.filter(note => { return note.id !== noteID })
                }
            }
        }
    },
    persist: {
        enabled: true
    }
})
