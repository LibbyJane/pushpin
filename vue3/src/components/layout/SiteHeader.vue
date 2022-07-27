<template>
    <header class="site-header container">
        <div class="content">
            <RouterLink class="site-logo" to="/">
                <img :src="Logo" alt="logo" />
            </RouterLink>

            <h1 class="page-title">
                {{ siteStore.pageTitle }}
            </h1>
        </div>

        <nav v-if="authenticated" class="user-nav">
            <ul>
                <li
                    class="nav-create"
                    data-tip="Send a note"
                    data-for="tt-send"
                    data-background-color="var(--biro)"
                >
                    <RouterLink to="/create">
                        <img class="icon" :src="CreateIcon" alt="Click to send a note" />
                    </RouterLink>
                </li>
                <li
                    class="nav-account"
                    data-tip="Your account"
                    data-for="tt-account"
                    data-background-color="var(--biro)"
                >
                    <RouterLink to="/account">
                        <Avatar />
                    </RouterLink>
                </li>
                <li
                    class="nav-logout"
                    data-tip="Log out"
                    data-for="tt-logout"
                    data-background-color="var(--biro)"
                >
                    <button type="button" v-on:click="userStore.performLogout">
                        <img class="icon" :src="LogoutIcon" alt="Click to send a note" />
                        <span class="visually-hidden">Log out</span>
                    </button>
                </li>
            </ul>

            <!-- <ReactTooltip id="tt-send" class="tooltip" />
                    <ReactTooltip id="tt-account" class="tooltip" />
                    <ReactTooltip id="tt-logout" class="tooltip" /> -->
        </nav>
    </header>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import Avatar from '@/components/Avatar.vue';
    import Logo from '@/assets/images/stamp-home.svg';
    import CreateIcon from '@/assets/icons/note.svg';
    import LogoutIcon from '@/assets/icons/log-out.svg';

    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const storeRef = storeToRefs(userStore);
    const authenticated = storeRef.getAuth;

    import { useSiteStore } from '@/stores/site';
    const siteStore = useSiteStore();
    const siteStoreRef = storeToRefs(siteStore);
</script>
