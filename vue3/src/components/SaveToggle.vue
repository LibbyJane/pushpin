<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import KeepOutlineIcon from '@/assets/icons/star-outline.svg';
    import KeepIcon from '@/assets/icons/star.svg';
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
        <img
            class="icon-checked"
            v-if="checked"
            :src="KeepIcon"
            alt="This note is saved"
        />
        <img class="icon-unchecked" v-else :src="KeepOutlineIcon" alt="Save this note" />
    </label>
</template>
