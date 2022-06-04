<template>
    <main class="pg-home">
        <NotesList />
    </main>
</template>

<script setup>
    // import { ref, reactive, provide } from 'vue';
    // import { useAPI } from '@/api/useAPI';
    // import { useUserStore } from '@/stores/user';
    // import { useNotesStore } from '@/stores/notes';
    import NotesList from '@/components/NotesList.vue';

    // const notesStore = useNotesStore();

    // const userStore = useUserStore();
    // if (!notesStore.getNotes) {
    //     console.log('get notes');

    //     const data = await useAPI(`notes`);
    //     if (data) {
    //         notesStore.updateNotes(data);
    //     }
    // }
</script>
