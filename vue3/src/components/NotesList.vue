<template>
    <h4>notes list</h4>

    <div class="list-notes">
        <Note v-for="note in notes" :data="note" />
    </div>
</template>

<script setup>
    import { useNotesStore } from '@/stores/notes';
    import Note from '@/components/Note.vue';
    const notesStore = useNotesStore();
    notesStore.setNotes();

    const notes = notesStore.getNotes;
</script>
