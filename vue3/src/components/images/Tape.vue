<template>
    <img src="@/assets/images/tape.svg" :class="cssClass" alt="Tape" />
</template>

<script setup>
    const props = defineProps({
        cssClass: {
            type: String,
            default: 'note-pin',
        },
    });
</script>
