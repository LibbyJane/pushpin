<template>
    <div
        v-if="data.status !== 'deleted'"
        :class="`note is-${data.style}`"
        :style="`background-color: ${data.color ? data.color : ''}`"
        :data-status="`${data.status ? data.status : null}`"
    >
        <header class="note-header">
            <SaveToggle
                v-if="data.id"
                :noteID="data.id"
                :activeStatus="`data.status ? ${data.status} : null`"
            />

            <button
                v-if="data.id"
                v-on:click="showConfirm = true"
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

        <!-- <teleport to="body"> -->
        <div v-if="showConfirm" ref="showConfirmRef" class="note-confirm">
            <div class="inner">
                <h6>Delete this note?</h6>
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
            </div>
        </div>
        <!-- </teleport> -->
    </div>
</template>

<script setup>
    import Reactions from '@/components/Reactions.vue';
    import SaveToggle from '@/components/SaveToggle.vue';
    import Avatar from '@/components/Avatar.vue';
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
