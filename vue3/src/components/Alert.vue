<template>
    <aside v-if="visible" :class="`alert ${variant ? 'is-' + variant : ''} `">
        <header class="alert-header">
            <h4 v-if="title" class="alert-title">{{ title }}</h4>
            }
            <button type="button" class="text" v-on:click="visible = false">
                x
                <span class="visually-hidden">Close notification</span>
            </button>
        </header>
        <slot></slot>
    </aside>
</template>

<script setup>
    const props = defineProps({
        variant: {
            type: String,
        },
        title: {
            type: String,
        },
        visible: {
            type: Boolean,
        },
    });
</script>
