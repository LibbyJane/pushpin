<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();

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

    if (userID) {
        const friends = userStore.getFriends;
        const match = friends.filter(matchId);
        data = match[0];
    } else {
        data = userStore.getInfo;
    }

    console.log('data: ', data);
</script>

<template>
    <div v-if="data" class="avatar" :style="`background-image: url(${data.imageURL})`">
        <img :src="data.imageURL" :alt="data.displayName" :title="data.displayName" />
    </div>
    <span v-if="data && showName" class="avatar-name">{{ data.displayName }}</span>
</template>
