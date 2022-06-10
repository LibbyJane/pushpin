<template>
    <div v-if="data" class="avatar">
        <div
            v-if="data.imageURL"
            class="avatar-image"
            :style="`background-image: url(${data.imageURL})`"
        >
            <img :src="data.imageURL" :alt="data.displayName" :title="data.displayName" />
        </div>

        <div
            v-else
            class="avatar-image"
            :style="`background-image: url(${DefaultAvatarImage})`"
        >
            <img
                :src="DefaultAvatarImage"
                :alt="data.displayName"
                :title="data.displayName"
            />
        </div>
        <span v-if="showName" class="avatar-name">{{ data.displayName }}</span>
    </div>
</template>

<script setup>
    import { reactive, toRefs } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';
    import { useAPI } from '@/api/useAPI';

    import DefaultAvatarImage from '@/assets/icons/person.svg';

    const userStore = useUserStore();
    const userStoreRef = storeToRefs(userStore);

    const props = defineProps({
        userID: {
            type: Number,
        },
        showName: {
            type: String,
        },
        userData: {
            type: Object,
        },
    });

    const { userID, showName, userData } = toRefs(props);

    function matchId(u) {
        return u.id === userID.value;
    }

    let data = null;

    if (userData.value) {
        data = userData.value;
    } else if (!userID.value) {
        // assume the logged in user if no ID supplied
        data = userStoreRef.getInfo;
    } else if (userStore.getAuth) {
        const friends = userStoreRef.getFriends.value;
        if (friends) {
            const match = friends.filter(matchId);
            data = match[0];
        }
    }
</script>
