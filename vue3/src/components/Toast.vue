<template>
    <aside v-if="message && visible" class="toast">
        <img v-if="icon" :src="getImageUrl(icon)" class="icon" :alt="`${icon} icon`" />
        <p>{{ message }}</p>
    </aside>
</template>

<script setup>
    import { ref, onMounted, onUpdated } from 'vue';

    let visible = ref(true);
    const props = defineProps({
        message: {
            type: String,
        },
        icon: {
            type: String,
        },
        test: {
            type: String,
        },
    });
    onUpdated(() => setVisibility());
    onMounted(() => setVisibility());

    function getImageUrl(id) {
        return new URL(`../../src/assets/icons/${id}.svg`, import.meta.url).href;
    }

    const setVisibility = () => {
        setTimeout(() => {
            visible.value = false;
        }, 3000);
    };
</script>
