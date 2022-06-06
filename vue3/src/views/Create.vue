<template>
    <main class="pg-create">
        <Alert :visible="alert.visible" :variant="alert.variant">
            <p>
                Your note has been sent! Would you like to
                <button v-on:click="alert.visible = false">send another</button> or
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

                <label>Style:</label>
                <ul class="checkable-list">
                    <li v-for="style in styles">
                        <label>
                            <input
                                type="radio"
                                name="noteStyle"
                                :value="style.value"
                                v-model="noteData.style"
                            />
                            {{ style.label }}
                        </label>
                    </li>
                </ul>

                <UploadFile
                    fieldID="notePhoto"
                    label="Note Image"
                    :required="true"
                    :onChangeHandler="setNoteImage"
                />

                <label>Color:</label>
                <ul class="checkable-list">
                    <li v-for="color in colors">
                        <label class="checkable has-swatch" :data-swatch="color.value">
                            <input
                                type="radio"
                                name="noteColor"
                                :value="color.value"
                                v-model="noteData.color"
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

                <label>Write your message:</label>
                <textarea required v-model="noteData.message"></textarea>

                <fieldset class="form-actions">
                    <button type="submit" class="btn">Send note</button>
                    <!-- <button type="reset" class="btn" onClick={() => navigate('/')}>Cancel</button> -->
                </fieldset>
            </form>
            <aside class="note-preview">
                <div v-if="noteData.recipientsList.length" class="note-recipients">
                    <h6>Sending to:</h6>
                    <Avatar
                        v-for="recipient in noteData.recipientsList"
                        :userID="recipient"
                        showName="true"
                    />
                </div>
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
    import { reactive, ref, toRefs, computed } from 'vue';

    import { useNotesStore } from '@/stores/notes';
    import { useUserStore } from '@/stores/user';

    import Note from '@/components/Note.vue';
    import Multiselect from '@/components/forms/Multiselect.vue';
    import UploadFile from '@/components/forms/UploadFile.vue';
    import Alert from '@/components/Alert.vue';
    import Avatar from '@/components/Avatar.vue';
    import CheckIcon from '@/assets/icons/check.svg';

    const notesStore = useNotesStore();
    const userStore = useUserStore();
    const user = userStore.getInfo;

    const styles = [
        { value: 'stickynote', label: 'Sticky Note' },
        { value: 'polaroid', label: 'Polaroid' },
        { value: 'postcard', label: 'Post Card' },
    ];

    const noteHasImage = computed(() => {
        return noteData.style !== 'stickynote' ? true : false;
    });

    const colors = [
        { value: 'var(--white)', label: 'White' },
        { value: 'var(--note-yellow)', label: 'Yellow' },
        { value: 'var(--note-pink)', label: 'Pink' },
        { value: 'var(--note-blue)', label: 'Blue' },
        { value: 'var(--note-green)', label: 'Green' },
    ];

    const noteDataInitial = {
        style: 'polaroid',
        message: null,
        color: null,
        imageURL: null,
        createdByID: user.id,
        recipientsList: [],
    };

    let noteData = reactive(Object.create(noteDataInitial));

    const noteErrors = reactive({
        style: null,
        message: null,
        color: null,
        image: null,
        createdByID: null,
        recipientsList: null,
    });

    let notePhoto = null;

    let friendsList = userStore.getFriends.map(formatFriendData);

    const alert = reactive({
        variant: 'success',
        visible: false,
    });

    function initForm() {
        notePhoto = null;
        noteData.message = null;
        noteData.color = null;
        noteData.imageURL = null;
        noteData.recipientsList = [];
    }

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

    function setNoteColor(color) {
        noteData.color = color;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let outcome = null;

        if (noteHasImage) {
            outcome = await notesStore.sendNote(noteData, notePhoto);
        } else {
            outcome = await notesStore.sendNote(noteData);
        }

        if (outcome.success) {
            alert.visible = true;
            initForm();
        }
    }
</script>
