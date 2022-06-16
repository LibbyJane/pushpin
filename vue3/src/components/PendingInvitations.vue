<template v-if="invitations">
    <button
        v-for="invitation in invitations"
        v-on:click="acceptInvitation(invitation.id)"
    >
        {{ invitation }}
        <hr />
        {{ invitation.firstName }}

        <Avatar :userData="invitation" showName="true" />
    </button>
</template>

<script setup>
    import Avatar from '@/components/Avatar.vue';

    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();
    const userStoreRef = storeToRefs(userStore);
    const user = userStoreRef.info;

    const invitations = await userStore.getInvitations();
    console.log('invitations?', invitations, typeof invitations);

    async function acceptInvitation() {}
</script>
