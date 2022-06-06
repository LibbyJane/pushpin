<template>
    <label v-if="label" :for="fieldID">{{ label }}</label>
    <Multiselect
        :id="fieldID"
        :name="fieldID"
        v-on:change="handler"
        v-model="selected"
        mode="tags"
        :options="options"
        class="multiselect-themed"
        :close-on-select="true"
    />
</template>

<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import Multiselect from '@vueform/multiselect';

    const props = defineProps({
        fieldID: {
            type: String,
        },
        handler: {
            type: Function,
        },
        selected: { type: Array },
        options: {
            type: Array,
            required: true,
        },
        trackBy: {
            type: String,
        },
        label: {
            type: String,
        },
        multiple: { type: Boolean },
        closeOnSelect: { type: Boolean },
        clearOnSelect: {
            type: Boolean,
        },
        placeholder: {
            type: String,
        },
        preserveSearch: {
            type: Boolean,
        },
        preselectFirst: {
            type: Boolean,
        },
    });
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
