<template>
    <label v-if="label" :for="id">{{ label }}</label>
    <input :id="id" type="text" v-if="visible" v-on:change="searchGiphy" />

    <button v-for="image in images.value" v-on:click="selectImage(image)">
        <!-- <img class="note-image-still" :src="image.images.fixed_height_still.url" /> -->
        <img class="note-image-animated" :src="image.images.fixed_height.url" />
    </button>
</template>

<script setup>
    import { reactive, toRefs } from 'vue';

    const props = defineProps({
        visible: Boolean,
        label: String,
        id: String,
        callback: Function,
    });

    let images = reactive([]);

    import { useGiphy } from '@/api/useGiphy';
    async function searchGiphy(e) {
        console.log('search giphy', e.target.value);
        const response = await useGiphy(e.target.value);
        console.log('component response, ', response);
        if (response.data) {
            console.log('yay but why no update?');
            images.value = response.data;
            console.log('bastard', images, images.value);
        }
    }

    const { callback } = toRefs(props);
    function selectImage(image) {
        images.value = [];
        callback.value(image);
    }
</script>
