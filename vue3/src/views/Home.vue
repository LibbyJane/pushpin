<template>
    <main class="pg-home cols">
        <NotesList />
        <FriendsList />
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Welcome');

    import NotesList from '@/components/NotesList.vue';
    import FriendsList from '@/components/FriendsList.vue';
</script>
