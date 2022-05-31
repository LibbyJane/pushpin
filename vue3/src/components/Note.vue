<script setup>
    import PinImage from '@/components/images/Pin.vue';
    import StampFrameImage from '@/components/images/StampFrame.vue';
    import Reactions from '@/components/Reactions.vue';
    import HeartToggle from '@/components/HeartToggle.vue';

    defineProps({
        data: {
            type: Object,
            required: true,
        },
    });
</script>

<template>
    <div
        :class="`note is-${data.style}`"
        :style="`background-color: ${data.color ? data.color : ''}`"
        :data-status="data.status"
    >
        <header class="note-header">
            <HeartToggle v-if="data.id" :noteID="data.id" :activeStatus="data.status" />

            <!-- {data.id && toggleHeart &&
                        <HeartToggle
                            val={data.id}
                            isSet={data.saved}
                            callback={toggleHeart}
                        />
                    } -->

            <button v-if="data.id" class="note-delete" type="button">
                <PinImage />
            </button>
            <PinImage v-else />

            <Reactions v-if="data.id" :noteID="data.id" :activeReaction="data.reaction" />
        </header>

        <div
            v-if="data.imageURL"
            class="note-image"
            style="`background-image: ${data.imageURL}`"
        >
            <img :src="data.imageURL" alt="note image" />
        </div>

        <div v-if="data.style === 'postcard'" class="stamp-postmark">
            <StampFrameImage />
            <!-- <Avatar id={note.createdByID} /> -->
        </div>

        <div class="note-message">
            {{ data.message }}
        </div>

        <footer class="note-footer">
            <h6>From</h6>
            <!-- <Avatar id={note.createdByID} showName={true} /> -->
        </footer>
    </div>
</template>

<style>
    h1 {
        font-weight: 500;
        font-size: 2.6rem;
        top: -10px;
    }

    h3 {
        font-size: 1.2rem;
    }

    .greetings h1,
    .greetings h3 {
        text-align: center;
    }

    @media (min-width: 1024px) {
        .greetings h1,
        .greetings h3 {
            text-align: left;
        }
    }
</style>
