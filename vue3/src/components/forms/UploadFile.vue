<template>
    <label for="notePhoto">{{ label }}</label>
    <input
        :name="fieldID"
        :id="fieldID"
        :required="required"
        type="file"
        v-on:change="setImage"
        ref="fileUploadInput"
    />
</template>

<script setup>
    import { reactive, ref, toRefs, nextTick } from 'vue';

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

    const fileUploadInput = ref(null);

    async function setImage(e) {
        let selected = e.target.files[0];
        console.log('selected', selected);

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
        // fileUploadInput.value = null;
        // fileUploadInput.type = 'text';
        // console.log('?', fileUploadInput.type);
        // fileUploadInput.type = 'file';
        // console.log('?', fileUploadInput.type);

        // await nextTick();
    }
</script>
