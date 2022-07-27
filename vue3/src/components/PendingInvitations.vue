<template>
    <div v-if="invitations.length" class="card is-lined">
        <header class="card-header">
            <h5>Friend Requests</h5>
        </header>
        <Toast v-if="showToastMessage" :message="showToastMessage" :icon="toastIcon" />
        <ul class="friends-list">
            <li v-for="(invitation, index) in invitations">
                <Avatar :userData="invitation" />
                <span
                    v-if="invitation.firstName || invitation.lastName"
                    class="invitation-sender"
                >
                    <template v-if="invitation.firstName"
                        >{{ invitation.firstName }}&nbsp;
                    </template>
                    <template v-if="invitation.lastName">{{
                        invitation.lastName
                    }}</template>
                </span>
                <small
                    class="invitation-sender-display-name"
                    v-if="invitation.firstName != invitation.displayName"
                >
                    ({{ invitation.displayName }})
                </small>

                <button
                    class="invitation-accept invitation-action"
                    v-on:click="handleClick('accept', invitation.code, index)"
                >
                    <img
                        :src="CheckIcon"
                        class="icon is-check"
                        alt="accept friend request"
                        title="accept friend request"
                        data-size="sm"
                    />
                </button>

                <button
                    class="invitation-reject invitation-action"
                    v-on:click="handleClick('reject', invitation.code, index)"
                >
                    <img
                        :src="CancelIcon"
                        data-size="sm"
                        class="icon is-cross"
                        alt="deny friend request"
                        title="deny friend request"
                    />
                </button>
                <!-- <div class="invitation-actions">
                </div> -->
            </li>
        </ul>
    </div>
</template>

<script setup>
    import Avatar from '@/components/Avatar.vue';
    import CheckIcon from '@/assets/icons/check.svg';
    import CancelIcon from '@/assets/icons/cross.svg';

    import Toast from '@/components/Toast.vue';
    import { ref } from 'vue';
    let showToastMessage = ref(false);
    let toastIcon = ref('check');

    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();
    const userStoreRef = storeToRefs(userStore);

    import { reactive } from 'vue';

    const invitations = reactive(await userStore.getInvitations());

    async function handleClick(action, invitationCode, index) {
        let response = null;
        showToastMessage.value = null;

        if (action === 'accept') {
            showToastMessage.value = 'Friend request accepted';

            response = await userStore.acceptInvitation(invitationCode);
            console.log('response', response);

            if (response.success) {
                showToastMessage.value = 'Friend request accepted';
                userStore.performSetFriends();
            }
        } else {
            response = await userStore.rejectInvitation(invitationCode);
        }

        invitations.splice(index, 1);
    }
</script>

<style scoped lang="scss">
    .card {
        transform: translateX(var(--space-lg)) rotate(2deg);
    }

    .card-header {
        min-height: 0;
        margin-bottom: 0;

        h5 {
            margin: 0;
        }
    }

    .is-check {
        &:hover,
        &:focus {
            filter: saturate(2) brightness(1.5);
        }
    }

    .is-cross {
        filter: grayscale(1) brightness(1.5);

        &:hover,
        &:focus {
            filter: grayscale(1) sepia(1) saturate(3) brightness(1.5) hue-rotate(315deg);
        }
    }

    li {
        display: grid;
        grid-gap: 0;
        grid-template-areas:
            'avatar invitation-sender invitation-accept '
            'avatar invitation-sender-display-name invitation-reject '
            'blank blank invitation-actions';
        align-items: center;

        &:hover,
        &:focus {
            .avatar {
                filter: grayscale(0);
            }
            .invitation-action {
                opacity: 1;
            }
        }
    }

    .avatar {
        grid-area: avatar;
        margin-bottom: var(--space-sm);
    }
    .invitation-sender {
        grid-area: invitation-sender;
    }

    .invitation-sender-display-name {
        grid-area: invitation-sender-display-name;
    }

    .invitation-accept {
        grid-area: invitation-accept;
    }

    .invitation-reject {
        grid-area: invitation-reject;
    }

    .invitation-action {
        opacity: 0.5;
        padding-left: var(--space-sm);
    }

    .invitation-actions {
        grid-area: invitation-actions;
    }
</style>
