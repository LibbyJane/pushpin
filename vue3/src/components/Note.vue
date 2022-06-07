<script setup>
    import Reactions from '@/components/Reactions.vue';
    import HeartToggle from '@/components/HeartToggle.vue';
    import Avatar from '@/components/Avatar.vue';
    import PinImage from '@/components/images/Pin.vue';
    import StampFrameImage from '@/components/images/StampFrame.vue';
    import { useNotesStore } from '@/stores/notes';
    const notesStore = useNotesStore();

    defineProps({
        data: {
            type: Object,
            required: true,
        },
    });

    function handleDelete(noteID) {
        notesStore.setStatus(noteID, 'deleted');
    }
</script>

<template>
    <div
        v-if="data.status !== 'deleted'"
        :class="`note is-${data.style}`"
        :style="`background-color: ${data.color ? data.color : ''}`"
        :data-status="`${data.status ? data.status : null}`"
    >
        <header class="note-header">
            <HeartToggle
                v-if="data.id"
                :noteID="data.id"
                :activeStatus="`data.status ? ${data.status} : null`"
            />

            <button
                v-if="data.id"
                v-on:click="handleDelete(data.id)"
                class="note-delete"
                type="button"
            >
                <PinImage />
            </button>
            <PinImage v-else />

            <Reactions v-if="data.id" :noteID="data.id" :activeReaction="data.reaction" />
        </header>

        <div
            v-if="data.style !== 'stickynote' && data.imageURL"
            class="note-image"
            :style="`background-image: url(${data.imageURL})`"
        >
            <img :src="data.imageURL" alt="note image" />
        </div>

        <div v-if="data.style === 'postcard'" class="stamp-postmark">
            <StampFrameImage />
            <Avatar :userID="data.createdByID" />
        </div>

        <div v-if="data.message" class="note-message">
            <p>{{ data.message }}</p>
        </div>

        <footer class="note-footer">
            <Avatar :userID="data.createdByID" showName="true" />
        </footer>
    </div>
</template>
