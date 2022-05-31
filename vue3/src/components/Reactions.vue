<script setup>
    import { useNotesStore } from '@/stores/notes';
    const notesStore = useNotesStore();

    defineProps({
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

    function getImageUrl(id) {
        return new URL(`../../src/assets/images/reaction-${id}.svg`, import.meta.url)
            .href;
    }

    function ActiveStatus(id, selectedId) {
        return id == selectedId;
    }

    function handleSelect(noteID, reactionID) {
        notesStore.setReaction(noteID, reactionID);
    }
</script>

<template>
    <ul class="list-reactions">
        <li v-for="reaction in reactions">
            <label class="checkable is-reaction">
                <input
                    type="radio"
                    :name="`reaction-${noteID}`"
                    :value="reaction.id"
                    :checked="reaction.id === activeReaction"
                    v-on:click="handleSelect(noteID, reaction.id)"
                />
                <img
                    :src="getImageUrl(reaction.id)"
                    class="icon"
                    :alt="`reaction-${reaction.name}`"
                />

                <span class="visually-hidden">{{ reaction.name }}</span>
            </label>
        </li>
        <!-- {
                reactions.map(reaction => (
                    <li key={reaction.id} data-active={ActiveStatus(reaction.id, selectedReaction)}>
                        <label class='checkable is-reaction' >
                            <input
                                type="radio"
                                name={`reaction-${noteID}`}
                                value={reaction.id}
                                onChange={(e) => handleChange(e.target.value)}
                            />
                            <img class="icon" src={reaction.image} alt={reaction.name} />
                            <span class='visually-hidden'>{reaction.name}</span>
                        </label>
                    </li>
                    // <li key={reaction.id} class={`reaction is-${reaction.name}`}>

                    //     {reaction.name}
                    // </li>
                ))
            } -->
    </ul>
</template>
