<template>
    <div v-if="reactions.length" class="card is-reactions">
        <img src="@/assets/images/pin-round-teal.png" class="card-pin" alt="Push Pin" />
        <h5>Reactions Received</h5>

        <ul class="reactions-list">
            <li class="reaction" v-for="reaction in reactions">
                <img
                    :src="getImageUrl(reaction.reaction)"
                    :alt="`${reaction.reaction}`"
                    class="reaction-image"
                />
                <span class="reaction-recipient">from {{ reaction.displayName }}</span>
                <small class="reaction-date">{{
                    formatTime(reaction.reactionUpdatedAt)
                }}</small>
                <!-- <Avatar :userID="reaction.recipientId" showName="true" /> -->
            </li>
        </ul>
    </div>
</template>

<script setup>
    import Avatar from '@/components/Avatar.vue';
    import TimeAgo from 'javascript-time-ago';
    import en from 'javascript-time-ago/locale/en';
    TimeAgo.addDefaultLocale(en);
    const timeAgo = new TimeAgo('en-GB');
    import { ref } from 'vue';
    let showToastMessage = ref(false);
    let toastIcon = ref('check');

    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();
    const userStoreRef = storeToRefs(userStore);

    import { reactive } from 'vue';

    const reactions = reactive(await userStore.getReactions());

    function getImageUrl(id) {
        return new URL(`../../src/assets/images/reaction-${id}.svg`, import.meta.url)
            .href;
    }

    function formatTime(timeStamp) {
        var d = new Date(timeStamp * 1000);
        return timeAgo.format(d);
    }
</script>

<style lang="scss" scoped>
    .card.is-reactions {
        transform: translateX(var(--space-lg)) rotate(1deg);
        padding-right: var(--space-lg);
    }

    h5 {
        text-align: center;
    }

    .reaction {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .avatar {
            filter: none;
        }

        .avatar-image {
            box-shadow: none;
        }

        // small {
        //     display: block;
        //     width: 100%;
        // }
    }

    .reaction-recipient {
        margin-right: var(--space-sm);
    }

    .reaction-image {
        --size: 2.4rem;
        height: var(--size);
        width: var(--size);
        // margin-right: var(--space-sm-neg);
        position: relative;
        z-index: var(--zi-base);
    }
</style>
