<template>
    <img src="@/assets/images/drawing-pin.webp" :class="cssClass" alt="Push Pin" />
</template>

<script setup>
    const props = defineProps({
        cssClass: {
            type: String,
            default: 'note-pin',
        },
    });
</script>
