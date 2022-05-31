<script setup>
    import HeartIcon from '@/assets/icons/Heart.svg';
    import StampFrameImage from '@/components/images/StampFrame.vue';
    import { useNotesStore } from '@/stores/notes';
    const notesStore = useNotesStore();

    defineProps({
        noteID: {
            type: Number,
            required: true,
        },
        activeStatus: {
            type: String,
        },
    });
</script>

<template>
    <h1>Heart toggle component</h1>
    <HeartIcon />
</template>
