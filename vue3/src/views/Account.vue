<template>
    <main class="pg-account">
        <div class="cols">
            <div class="card col">
                <h1>hello {{ user.displayName }}</h1>
                <UploadFile
                    fieldID="profilePhoto"
                    label="Profile Image"
                    :onChangeHandler="setProfilePhoto"
                />
            </div>

            <aside class="sidebar">
                <Invitation />
            </aside>
        </div>
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('My account');

    import Invitation from '@/components/Invitation.vue';
    import UploadFile from '@/components/forms/UploadFile.vue';

    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();
    const storeRef = storeToRefs(userStore);
    const user = storeRef.info;

    const setProfilePhoto = async (selected) => {
        await userStore.updatePhoto(selected);
    };
</script>
