<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import HeartOutlineIcon from '@/assets/icons/heart-outline.svg';
    import HeartIcon from '@/assets/icons/heart.svg';
    import { useNotesStore } from '@/stores/notes';

    const notesStore = useNotesStore();

    const props = defineProps({
        noteID: {
            type: Number,
            required: true,
        },
        activeStatus: {
            type: String,
        },
    });

    const { activeStatus, noteID } = toRefs(props);

    let checked = ref();

    if (activeStatus.value === 'saved') {
        checked.value = true;
    }

    function handleChange() {
        const status = checked.value ? 'saved' : 'null';
        notesStore.setStatus(noteID.value, status);
    }
</script>

<template>
    <label class="checkable is-toggle is-save">
        <input
            type="checkbox"
            :value="activeStatus"
            v-model="checked"
            v-on:change="handleChange(checked)"
        />
        <img class="icon-checked" v-if="checked" :src="HeartIcon" alt="Heart Icon" />
        <img
            class="icon-unchecked"
            v-else
            :src="HeartOutlineIcon"
            alt="Heart Outline Icon"
        />
    </label>
</template>
