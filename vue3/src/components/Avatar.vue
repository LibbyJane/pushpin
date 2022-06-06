<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import { useUserStore } from '@/stores/user';
    import DefaultAvatarImage from '@/assets/icons/person.svg';

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

    if (userID.value) {
        const friends = userStore.getFriends;
        const match = friends.filter(matchId);
        data = match[0];
    } else {
        data = userStore.getInfo;

        if (data.imageURL === null) {
            data.imageURL = DefaultAvatarImage;
        }
    }
</script>

<template>
    <div v-if="data" class="avatar">
        <div class="avatar-image" :style="`background-image: url(${data.imageURL})`">
            <img :src="data.imageURL" :alt="data.displayName" :title="data.displayName" />
        </div>
        <span v-if="showName" class="avatar-name">{{ data.displayName }}</span>
    </div>
</template>
