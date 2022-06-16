<template>
    <div class="card is-torn">
        <h5>
            <img class="icon" :src="SearchIcon" alt="Find a friend" />Search for a friend
        </h5>
        <form v-on:submit="performSearch">
            <fieldset>
                <input
                    v-on:keyup="performSearch"
                    v-model="searchTerm"
                    type="text"
                    minLen="2"
                />
            </fieldset>
            <button class="btn">Search</button>
        </form>

        <Toast v-if="showToastMessage" message="Friend request sent" icon="check" />
        <ul v-if="results" class="friends-list">
            <li v-for="result in results.value">
                <button class="btn-add" v-on:click="sendFriendRequest(result.id)">
                    <p>
                        <Avatar :userData="result" size="sm" />
                        <span class="result-name">
                            {{ result.firstName }} {{ result.lastName }} <br />
                            <i>({{ result.displayName }})</i>
                        </span>
                    </p>
                    <img
                        class="icon is-add"
                        data-size="sm"
                        :src="AddIcon"
                        alt="Send a friend request"
                    />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { ref, reactive, watch } from 'vue';
    import { useAPI } from '@/api/useAPI';

    import Avatar from '@/components/Avatar.vue';

    import SearchIcon from '@/assets/icons/search.svg';
    import AddIcon from '@/assets/icons/cross.svg';

    let searchTerm = ref('');
    let results = reactive([]);

    watch(searchTerm, async (searchTerm) => {
        if (!searchTerm) {
            results.value = [];
        }
    });

    const performSearch = async (e) => {
        e.preventDefault();

        if (searchTerm) {
            console.log('perform search for', searchTerm);
            results.value = await useAPI(
                `user`,
                null,
                `/search?query=${searchTerm.value}`
            );
        }
    };

    import Toast from '@/components/Toast.vue';
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();

    let showToastMessage = ref(false);

    const sendFriendRequest = async (userID) => {
        showToastMessage.value = false;

        const response = await userStore.inviteUser(userID);
        console.log('sfr response', response);
        console.log('show toast1?', showToastMessage.value);
        if (response.success) {
            showToastMessage.value = true;
            console.log('show toast2?', showToastMessage.value);
        }
    };
</script>

<style scoped lang="scss">
    h5 {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;

        .icon {
            margin-right: var(--space-sm);
        }
    }
    form {
        display: flex;
        align-items: center;
    }

    fieldset {
        padding-right: var(--space);
    }

    li {
        border-bottom: thin dashed;
    }

    .is-add {
        transform: rotate(-45deg);
    }

    .btn-add {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: left;

        &:hover,
        &:focus {
            .avatar {
                filter: none;
            }
        }

        p {
            display: flex;
            font-size: 1rem;
            margin: 0;
            padding: 0;
        }

        i {
            font-style: normal;
            font-family: var(--font-hand);
            font-size: var(--p-sm);
        }
    }
</style>
