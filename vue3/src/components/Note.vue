<template>
    <div
        v-if="data.status !== 'deleted'"
        :class="`note is-${data.style}`"
        :style="`background-color: ${data.color ? data.color : ''}`"
        :data-status="`${data.status ? data.status : null}`"
    >
        <div class="note-pin">
            <button
                v-if="data.id"
                v-on:click="showConfirm = true"
                class="note-delete"
                type="button"
            >
                <PinImage />
            </button>
            <PinImage v-else />
        </div>
        <Alert
            variant="danger"
            v-if="showConfirm"
            ref="showConfirmRef"
            class="note-confirm"
            title="Delete this note?"
        >
            <!-- <teleport to="body"> -->

            <button
                class="btn margin-right"
                type="button"
                v-on:click="handleDelete(data.id)"
            >
                <img
                    :src="CheckIcon"
                    alt="Confirm Delete"
                    class="icon is-check"
                    data-size="sm"
                />
                Yes
            </button>
            <button
                type="button"
                class="btn is-text is-small margin-left"
                v-on:click="showConfirm = false"
            >
                <img
                    :src="CancelIcon"
                    alt="Cancel"
                    class="icon is-cancel"
                    data-size="sm"
                />Cancel
            </button>

            <!-- </teleport> -->
        </Alert>

        <header class="note-header">
            <SaveToggle v-if="data.id" :noteID="data.id" :activeStatus="data.status" />
            <!--
            <Avatar :userID="data.createdByID" /> -->

            <Reactions v-if="data.id" :noteID="data.id" :activeReaction="data.reaction" />
        </header>

        <template v-if="data.style === 'instant-photo'">
            <div v-if="data.imageURL" class="note-image">
                <img :src="data.imageURL" alt="note image" class="note-image-still" />
            </div>

            <div
                v-else-if="data.giphyMetadata && data.giphyMetadata.imageURL"
                class="note-image is-giphy"
            >
                <img
                    class="note-image-animated"
                    :src="data.giphyMetadata.imageURL"
                    alt="note image"
                />
                <img
                    class="note-image-still"
                    :src="data.giphyMetadata.staticImageURL"
                    alt="note image"
                />
            </div>
        </template>

        <!-- :style="`background-image: url(${data.imageURL})`" -->
        <template v-if="data.style === 'postcard'">
            <div
                v-if="data.imageURL"
                class="note-image"
                :style="`background-image: url(${data.imageURL})`"
            >
                <img :src="data.imageURL" alt="Note image" />
            </div>

            <div class="stamp-postmark">
                <StampFrameImage />
                <Avatar :userID="data.createdByID" />
            </div>
        </template>
        <div v-if="data.message" class="note-message">
            <p>{{ data.message }}</p>
        </div>

        <footer class="note-footer">
            <Avatar :userID="data.createdByID" showName="true" size="xs" />
        </footer>
    </div>
</template>

<script setup>
    import Reactions from '@/components/Reactions.vue';
    import SaveToggle from '@/components/SaveToggle.vue';
    import Avatar from '@/components/Avatar.vue';
    import Alert from '@/components/Alert.vue';
    import PinImage from '@/components/images/Pin.vue';
    import CheckIcon from '@/assets/icons/check.svg';
    import CancelIcon from '@/assets/icons/cross.svg';

    import StampFrameImage from '@/components/images/StampFrame.vue';
    import { useNotesStore } from '@/stores/notes';

    const notesStore = useNotesStore();

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        },
    });

    import { ref } from 'vue';
    import { onClickOutside, useConfirmDialog } from '@vueuse/core';

    const showConfirm = ref(false);
    const showConfirmRef = ref(null);

    onClickOutside(showConfirmRef, (event) => {
        showConfirm.value = false;
    });

    const handleDelete = async (noteID) => {
        showConfirm.value = false;
        notesStore.setStatus(noteID, 'deleted');
    };
</script>
