<template>
    <p class="error">
        {{ message }}
    </p>
</template>

<script setup>
    const props = defineProps({
        message: {
            type: String,
        },
    });
</script>
