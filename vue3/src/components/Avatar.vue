<script setup>
    import { toRefs } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    import DefaultAvatarImage from '@/assets/icons/person.svg';

    const userStore = useUserStore();
    const storeRef = storeToRefs(userStore);

    const props = defineProps({
        userID: {
            type: Number,
        },
        showName: {
            type: String,
        },
    });

    let data = null;

    const { userID, showName } = toRefs(props);

    function matchId(u) {
        return u.id === userID.value;
    }

    if (userID.value) {
        const friends = storeRef.getFriends.value;
        if (friends) {
            const match = friends.filter(matchId);
            data = match[0];
        }
    } else {
        data = storeRef.getInfo;
    }
</script>

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
