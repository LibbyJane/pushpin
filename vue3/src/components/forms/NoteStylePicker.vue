<template>
    <label v-if="label">{{ label }}</label>

    <ul class="checkable-list">
        <li v-for="style in styles">
            <label>
                <input
                    type="radio"
                    name="noteStyle"
                    :value="style.value"
                    v-on:change="handleChange"
                    :checked="style.value === initalValue"
                />
                {{ style.label }}
            </label>
        </li>
    </ul>
</template>

<script setup>
    import { reactive, toRefs } from 'vue';
    import CheckIcon from '@/assets/icons/check.svg';

    const styles = [
        { value: 'stickynote', label: 'Sticky Note' },
        { value: 'polaroid', label: 'Polaroid' },
        { value: 'postcard', label: 'Post Card' },
    ];

    const props = defineProps({
        label: String,
        callback: Function,
        initalValue: String,
    });

    const { callback } = toRefs(props);
    function handleChange(e) {
        console.log('handle change', e.target.value);
        callback.value(e.target.value);
    }
</script>
