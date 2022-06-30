<script setup>
    import { reactive, ref, toRefs, computed } from 'vue';
    import KeepOutlineIcon from '@/assets/icons/star-outline.svg';
    //import KeepIcon from '@/assets/icons/star-solid.svg';

    import KeepIcon from '@/assets/images/star-gold.png';
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

    const checkedState = computed(() => {
        return activeStatus.value === 'saved' ? true : false;
    });

    function handleChange() {
        const status = checked.value ? 'saved' : 'null';
        console.log('toggle clicked', status);
        notesStore.setStatus(noteID.value, status);
    }
</script>

<template>
    <label class="checkable is-toggle is-save">
        <input
            type="checkbox"
            :value="activeStatus"
            :checked="checkedState"
            v-model="checked"
            v-on:change="handleChange(checked)"
        />
        <img
            class="icon is-saved"
            v-if="checked"
            :src="KeepIcon"
            alt="This note is saved"
        />
        <img class="icon is-default" v-else :src="KeepOutlineIcon" alt="Save this note" />
    </label>
</template>
