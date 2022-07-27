<template>
    <label v-if="label">{{ label }}</label>

    <ul class="checkable-list">
        <li v-for="color in colors">
            <label class="checkable has-swatch" :data-swatch="color.value">
                <input
                    type="radio"
                    :name="name"
                    :value="color.value"
                    v-on:change="handleChange"
                    :checked="color.value === initialValue"
                />
                <span
                    class="swatch"
                    :style="`background-color: ${color.value}; color: ${color.value}`"
                >
                    <img class="icon" :src="CheckIcon" alt="selected icon" />
                </span>
                <span class="checkable-text">{{ color.label }}</span>
            </label>
        </li>
    </ul>
</template>

<script setup>
    import { reactive, toRefs } from 'vue';
    import CheckIcon from '@/assets/icons/check.svg';

    const colors = [
        { value: 'var(--white)', label: 'White' },
        { value: 'var(--note-yellow)', label: 'Yellow' },
        { value: 'var(--note-pink)', label: 'Pink' },
        { value: 'var(--note-blue)', label: 'Blue' },
        { value: 'var(--note-green)', label: 'Green' },
    ];

    const props = defineProps({
        label: String,
        name: String,
        initialValue: String,
        callback: Function,
    });

    const { callback } = toRefs(props);
    function handleChange(e) {
        callback.value(e.target.value);
    }
</script>
