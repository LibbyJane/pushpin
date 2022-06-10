<template>
    <main class="pg-invite">
        <div class="cols">
            <div class="card col">
                <h1>invite</h1>
                <Toast
                    v-if="showToastMessage"
                    message="Copied to clipboard"
                    icon="check"
                    test="test"
                />

                <button type="button" v-on:click="inviteFriend">get invitationURL</button>
                <Error v-if="error" :message="error" />
                <button type="button" v-if="invitationURL" v-on:click="copyToClipboard">
                    {{ invitationURL }}
                </button>
                <ShareLink v-if="invitationURL" :url="invitationURL" />
            </div>
        </div>
    </main>
</template>

<script setup>
    import { ref, nextTick } from 'vue';
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Invite a friend');

    import Toast from '@/components/Toast.vue';
    import Error from '@/components/Error.vue';
    import ShareLink from '@/components/ShareLink.vue';

    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();

    let invitationURL = ref(null);
    let error = ref(null);
    let showToastMessage = ref(false);

    const inviteFriend = async () => {
        const response = await userStore.generateInvitationCode();

        if (response.success) {
            console.log(`${window.location.origin}/signup/${response.code}`);
            invitationURL.value = `${window.location.origin}/signup/${response.code}`;
        } else {
            error = response.error;
        }
    };

    const copyToClipboard = async () => {
        showToastMessage.value = false;

        console.log('clickety');
        navigator.clipboard.writeText(invitationURL.value);
        await nextTick();
        showToastMessage.value = true;
    };
</script>
