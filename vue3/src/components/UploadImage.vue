<template>
    <label for="{{fieldID}}">{{ labelText }}</label>
    <input
        name="{{fieldID}}"
        id="{{fieldID}}"
        :required="required"
        type="file"
        v-on:change="handleChange"
    />
</template>

<script setup>
    const props = defineProps({
        fieldID: {
            type: String,
        },
        labelText: {
            type: String,
        },
        required: {
            type: Boolean,
        },
        handleChange: {
            type: Function,
        },
    });
</script>
