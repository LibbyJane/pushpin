<template>
    <ul
        :class="`list-reactions ${expanded ? 'is-expanded' : ''}`"
        :data-selected="selectedReaction"
        v-on:mouseover="expanded = true"
        v-on:mouseleave="expanded = false"
    >
        <li v-if="!selectedReaction" class="reaction-default">
            <img :src="PlaceholderIcon" class="icon" alt="Add a reaction" />
        </li>
        <li v-for="reaction in reactions">
            <label class="checkable is-reaction">
                <input
                    type="radio"
                    :name="`reaction-${noteID}`"
                    :value="reaction.id"
                    :id="reaction.id"
                    v-model="selectedReaction"
                    v-on:change="handleChange()"
                    :disabled="!expanded"
                />
                <img
                    :src="getImageUrl(reaction.id)"
                    class="icon"
                    :alt="`reaction-${reaction.name}`"
                />

                <span class="visually-hidden">{{ reaction.name }}</span>
            </label>
        </li>
    </ul>
</template>

<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import { useNotesStore } from '@/stores/notes';
    import PlaceholderIcon from '@/assets/images/reaction-placeholder.svg';

    const notesStore = useNotesStore();
    // props: ['noteID', 'activeReaction'];

    const props = defineProps({
        noteID: {
            type: Number,
            required: true,
        },
        activeReaction: {
            type: String,
        },
    });

    const reactions = [
        {
            id: 'heart',
            name: 'heart',
        },
        {
            id: 'smile',
            name: 'smile',
        },
        {
            id: 'cool',
            name: 'cool',
        },
        {
            id: 'star',
            name: 'star',
        },
    ];

    const { activeReaction, noteID } = toRefs(props);

    let selectedReaction = ref();
    let expanded = ref(false);

    if (activeReaction.value) {
        selectedReaction.value = activeReaction.value;
    }

    function getImageUrl(id) {
        return new URL(`../../src/assets/images/reaction-${id}.svg`, import.meta.url)
            .href;
    }

    function handleChange() {
        notesStore.setReaction(noteID.value, selectedReaction.value);
        expanded.value = false;
    }

    function toggleExpanded() {
        console.log('toggle expanded');
        expanded.value = !expanded.value;
    }
</script>
