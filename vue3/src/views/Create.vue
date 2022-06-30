<template>
    <main class="pg-create">
        <Alert v-if="alert.visible.value" :variant="alert.variant">
            <p>
                Your note has been sent! Would you like to
                <button v-on:click="alert.visible = false" class="btn is-text">
                    send another
                </button>
                or
                <RouterLink to="/" class="is-highlighted"
                    >go back to your board</RouterLink
                >?
            </p>
        </Alert>

        <div class="cols">
            <form
                id="{id}"
                class="card form-create has-max-width"
                v-on:submit="handleSubmit"
            >
                <Multiselect
                    fieldID="recipients"
                    label="Send to:"
                    :selected="noteData.recipientsList"
                    :options="friendsList"
                    :handler="updateSelectedFriends"
                />

                <NoteStylePicker
                    label="Style:"
                    :initalValue="noteData.style"
                    :callback="setNoteStyle"
                />

                <ColourPicker
                    label="Colour: "
                    name="noteColor"
                    :initialValue="noteData.color"
                    :callback="setNoteColor"
                />

                <UploadFile
                    v-if="noteHasImage"
                    fieldID="notePhoto"
                    label="Upload an Image"
                    :onChangeHandler="setNoteImage"
                />

                <Giphy
                    v-if="noteData.style === 'instant-photo'"
                    label="Or search Giphy: "
                    :id="noteGiphy"
                    :visible="noteHasImage"
                    :callback="setNoteGiphyImage"
                />

                <label>Write your message:</label>
                <textarea required v-model="noteData.message" maxlength="500"></textarea>

                <fieldset class="form-actions">
                    <button type="submit" class="btn">Send note</button>
                    <!-- <button type="reset" class="btn" onClick={() => navigate('/')}>Cancel</button> -->
                </fieldset>
            </form>
            <aside class="note-preview">
                <Note
                    v-if="noteData.style === 'postcard' && noteData.imageURL"
                    :data="noteData"
                />
                <Note :data="noteData" />
            </aside>
        </div>
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Send a note');

    import { reactive, ref, computed, watch } from 'vue';

    import { useNotesStore } from '@/stores/notes';
    import { useUserStore } from '@/stores/user';

    import Note from '@/components/Note.vue';
    import Multiselect from '@/components/forms/Multiselect.vue';
    import UploadFile from '@/components/forms/UploadFile.vue';
    import NoteStylePicker from '@/components/forms/NoteStylePicker.vue';
    import ColourPicker from '@/components/forms/ColourPicker.vue';

    import Giphy from '@/components/Giphy.vue';
    import Alert from '@/components/Alert.vue';
    import Avatar from '@/components/Avatar.vue';

    const notesStore = useNotesStore();
    const userStore = useUserStore();
    const user = userStore.info;

    const noteHasImage = computed(() => {
        return noteData.style !== 'stickynote' ? true : false;
    });

    import { useRoute } from 'vue-router';
    let recipientID = useRoute().params.id;

    const noteDataInitial = {
        style: 'instant-photo',
        message: null,
        color: 'var(--white)',
        imageURL: null,
        giphyMetadata: {
            imageURL: null,
            staticImageURL: null,
            giphyID: null,
        },
        createdByID: user.id,
        recipientsList: recipientID ? [recipientID] : [],
    };

    let noteData = reactive(noteDataInitial);

    const noteErrors = reactive({
        style: null,
        message: null,
        color: null,
        image: null,
        createdByID: null,
        recipientsList: null,
    });

    let notePhoto = null;

    function initForm() {
        notePhoto = null;
        noteData.message = null;
        noteData.color = null;
        noteData.imageURL = null;
        noteData.giphyMetadata = {
            imageURL: null,
            staticImageURL: null,
            giphyID: null,
        };
        noteData.recipientsList = [];
    }

    let friendsList = userStore.friends.map(formatFriendData);

    let alert = {
        variant: 'success',
        visible: ref(false),
    };

    function formatFriendData(friend) {
        return { value: friend.id, label: friend.displayName };
    }

    function updateSelectedFriends(friendsArray) {
        noteData.recipientsList = friendsArray;
    }

    function setNoteImage(selected) {
        noteData.imageURL = URL.createObjectURL(selected);
        notePhoto = selected;
    }

    function setNoteGiphyImage(image) {
        console.log('original note data', noteData);
        noteData.giphyMetadata.imageURL = image.images.fixed_height.url;
        noteData.giphyMetadata.staticImageURL = image.images.fixed_height_still.url;
        noteData.giphyMetadata.giphyID = image.id;

        // const newNoteData = { noteData, ...giphyMetadata };

        //Object.assign(noteData, newNoteData); // equivalent to reassign

        // noteData.giphyMetadata.value = giphyMetadata;
        noteData.imageURL = null;
        notePhoto = null;

        console.log('updated note data', noteData, noteData.giphyMetadata.giphyID);
    }

    function setNoteColor(color) {
        noteData.color = color;
    }

    function setNoteStyle(style) {
        console.log('note style', style);
        noteData.style = style;
    }

    // watch(noteData, async (newNoteData, oldNoteData) => {
    //     console.log('?', alert.visible);
    //     if (alert.visible) {
    //         alert.visible = false;
    //     }
    // });

    async function handleSubmit(e) {
        e.preventDefault();
        let outcome = null;
        console.log('note data', noteData);
        console.log('updated note data', noteData, noteData.giphyMetadata.giphyID);

        if (noteHasImage && notePhoto) {
            outcome = await notesStore.sendNote(noteData, notePhoto);
        } else {
            outcome = await notesStore.sendNote(noteData);
        }

        console.log('outcome', outcome);

        if (outcome.success) {
            alert.visible = true;
            console.log('success', alert.visible);
            initForm();
        }
    }
</script>
