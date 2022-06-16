<template>
    <main class="pg-home cols">
        <NotesList />
        <FriendsList />
        <PendingInvitations />
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Welcome');

    import NotesList from '@/components/NotesList.vue';
    import PendingInvitations from '@/components/PendingInvitations.vue';

    import FriendsList from '@/components/FriendsList.vue';
</script>
