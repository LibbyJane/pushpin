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
    >
        <template v-slot:tag="{ option, handleTagRemove, disabled }">
            <div
                class="multiselect-tag is-user"
                :class="{
                    'is-disabled': disabled,
                }"
            >
                <Avatar :userID="option.value" />
                {{ option.label }}
                <span
                    v-if="!disabled"
                    class="multiselect-tag-remove"
                    @mousedown.prevent="handleTagRemove(option, $event)"
                >
                    <span class="multiselect-tag-remove-icon"></span>
                </span>
            </div>
        </template>
    </Multiselect>
</template>

<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import Multiselect from '@vueform/multiselect';
    import Avatar from '@/components/Avatar.vue';

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
