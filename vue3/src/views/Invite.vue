<template>
    <main class="pg-invite">
        <div class="cols">
            <div
                class="note is-invitation"
                :style="`background-image: url(${InvitationBg})`"
            >
                <header class="note-header">
                    <PinImage />
                </header>
                <div class="note-message">
                    <Toast
                        v-if="showToastMessage"
                        message="Copied to clipboard"
                        icon="check"
                        test="test"
                    />
                    <button type="button" v-on:click="copyToClipboard">
                        <h4 class="invitation-heading">
                            Here&rsquo;s your personal
                            <strong>invitation link</strong>
                        </h4>
                        <hr />
                        <p v-on:click="copyToClipboard">
                            Click to copy this link to share with a friend &ndash;
                            you&rsquo;ll automatically connect when they register.
                        </p>
                        <p>
                            <small>{{ invitationURL }}</small>
                        </p>
                    </button>
                    <ShareLink :url="invitationURL" />
                </div>
            </div>
            <FindFriend />
        </div>
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Invite a friend');

    import FindFriend from '@/components/FindFriend.vue';

    import InvitationBg from '@/assets/images/palm396.jpg';
    import Paper from '@/assets/images/Paper.jpg';
    import PinImage from '@/components/images/Pin.vue';

    import { ref, nextTick } from 'vue';

    import Toast from '@/components/Toast.vue';
    import Error from '@/components/Error.vue';
    import ShareLink from '@/components/ShareLink.vue';

    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();

    const invitation = await userStore.generateInvitationCode();
    const invitationURL = ref(`${window.location.origin}/invitation/${invitation.code}`);

    let error = ref(null);

    let showToastMessage = ref(false);

    // const generateInvitationCode = async () => {
    //     if (invitationURL.value === null) {
    //         const response = await userStore.generateInvitationCode();

    //         if (response.success) {
    //             invitationURL.value = `${window.location.origin}/signup/${response.code}`;
    //         } else {
    //             error = response.error;
    //         }
    //     }
    // };

    const copyToClipboard = async () => {
        showToastMessage.value = false;
        navigator.clipboard.writeText(invitationURL.value);
        await nextTick();
        showToastMessage.value = true;
    };
</script>
