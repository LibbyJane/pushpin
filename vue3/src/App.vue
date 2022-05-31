<template>
    <SiteHeader />

    <RouterView />

    <!-- <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view> -->
</template>

<script setup>
    import SiteHeader from '@/components/Layout/SiteHeader.vue';
</script>
