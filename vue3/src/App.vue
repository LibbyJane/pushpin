<template>
    <!-- <RouterView /> -->
    <SiteHeader />
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition mode="out-in">
                <KeepAlive>
                    <Suspense>
                        <component :is="Component"></component>
                        <template #fallback> Loading... </template>
                    </Suspense>
                </KeepAlive>
            </Transition>
        </template>
    </RouterView>
</template>

<script setup>
    import SiteHeader from '@/components/layout/SiteHeader.vue';
</script>
