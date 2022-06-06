<script setup>
    import { ref } from 'vue';

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

    // function handleCloseAlert() {
    //     notesStore.setStatus(noteID, 'deleted');
    // }
</script>

<template>
    <aside v-if="visible" :className="`alert ${variant ? 'is-' + variant : ''} `">
        <header className="alert-header">
            <h4 v-if="title" className="alert-title">{{ title }}</h4>
            }
            <button type="button" class="text" v-on:click="visible = false">
                x
                <span className="visually-hidden">Close notification</span>
            </button>
        </header>
        <slot></slot>
    </aside>
</template>
