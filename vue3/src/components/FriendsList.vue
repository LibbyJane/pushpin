<template>
    <div class="card is-lined">
        <header class="card-header">
            <img class="icon is-contacts" alt="contacts" :src="ContactsIcon" />
            <h6>Contacts</h6>
            <hr />
        </header>

        <ul class="friends-list">
            <li v-for="friend in friends">
                <RouterLink :to="`/create/${friend.id}`">
                    <Avatar :userID="friend.id" showName="true" size="sm" />
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();
    const { friends } = storeToRefs(userStore);

    import Avatar from '@/components/Avatar.vue';
    import ContactsIcon from '@/assets/icons/contacts.svg';
</script>

<style scoped lang="scss">
    .card {
        transform: translateX(var(--space-lg)) rotate(-1deg);
    }

    .card-header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        font-weight: normal;
        min-height: 0;
        margin-bottom: 0;

        .icon {
            margin: auto var(--space-sm) auto 0;
        }

        h6 {
            margin: 0;
            padding: 0;
        }

        hr {
            flex: 0 0 100%;
            margin: var(--space-xs) auto;
            transform: rotate(180deg);
        }
    }

    a {
        text-decoration: none;
    }
</style>
