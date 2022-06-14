<template>
    <div class="list-notes">
        <Note v-for="note in notes" :data="note" />
        <NoNotes v-if="notes.length === 0" />
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useNotesStore } from '@/stores/notes';
    import Note from '@/components/Note.vue';
    import NoNotes from '@/components/NoNotes.vue';

    const notesStore = useNotesStore();
    const { notes } = storeToRefs(notesStore);
    await notesStore.setNotes();
</script>
