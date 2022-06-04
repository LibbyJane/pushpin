<template>
    <!-- <RouterView /> -->
    <SiteHeader />
    <router-view v-slot="{ Component }">
        <suspense>
            <template #default>
                <component :is="Component"></component>
            </template>
            <template #fallback>
                <div>Loading...</div>
            </template>
        </suspense>
    </router-view>
</template>

<script setup>
    import SiteHeader from '@/components/Layout/SiteHeader.vue';
</script>
