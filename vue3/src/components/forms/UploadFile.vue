<template>
    <label for="notePhoto">{{ label }}</label>
    <input
        :name="fieldID"
        :id="fieldID"
        :required="required"
        type="file"
        v-on:change="setNoteImage"
    />
</template>

<script setup>
    import { reactive, ref, toRefs } from 'vue';

    const props = defineProps({
        fieldID: {
            type: String,
        },
        label: { type: String },
        required: { type: Boolean },
        onChangeHandler: {
            type: Function,
        },
    });

    function setNoteImage(e) {
        let selected = e.target.files[0];

        if (!selected) {
            noteErrors.image = 'Please select a file';
            return;
        }
        if (!selected.type.includes('image')) {
            noteErrors.image = 'Selected file must be an image';
            return;
        }

        if (selected.size > 200000) {
            noteErrors.image = 'Image file size must be less than 200kb';
            return;
        }

        props.onChangeHandler(selected);
    }
</script>
