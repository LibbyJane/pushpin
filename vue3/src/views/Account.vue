<template>
    <main class="pg-account">
        <div className="cols">
            <div className="card col">
                <h1>hello {{ user.displayName }}</h1>

                <label for="notePhoto">Profile Image</label>
                <input
                    name="profilePhoto"
                    id="profilePhoto"
                    type="file"
                    v-on:change="setProfilePhoto"
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

    const userStore = useUserStore();
    const storeRef = storeToRefs(userStore);
    const user = storeRef.getInfo;

    console.log('user info', user);

    const setProfilePhoto = async (e) => {
        console.log('set photo');
    };
</script>
