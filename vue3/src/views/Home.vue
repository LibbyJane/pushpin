<template>
    <main class="pg-home">
        <NotesList />
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Welcome');

    import NotesList from '@/components/NotesList.vue';
</script>
