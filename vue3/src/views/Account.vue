<template>
    <main class="pg-account">
        <div className="cols">
            <div className="card col">
                <h1>hello {{ user.displayName }}</h1>
                <UploadFile
                    fieldID="profilePhoto"
                    label="Profile Image"
                    :onChangeHandler="setProfilePhoto"
                />
            </div>

            <div className="card col">
                <h1>hello {{ user.displayName }}</h1>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { ref, reactive } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';
    import UploadFile from '@/components/forms/UploadFile.vue';

    const userStore = useUserStore();
    const storeRef = storeToRefs(userStore);
    const user = storeRef.getInfo;

    const setProfilePhoto = async (selected) => {
        await userStore.updatePhoto(selected);
    };
</script>
