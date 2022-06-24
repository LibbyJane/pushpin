<template>
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="cols justify-start">
        <div class="col">
            <input
                :id="id"
                type="text"
                v-if="visible"
                v-on:keyup="searchGiphy"
                v-model="searchTerm"
            />
        </div>
        <button
            type="button"
            v-on:click="
                () => {
                    images.value = null;
                }
            "
        >
            <img :src="SearchIcon" class="icon is-search" alt="search" />
            <span class="visually-hidden">Search Giphy</span>
        </button>
        <button
            type="reset"
            v-on:click="
                () => {
                    images.value = null;
                }
            "
        >
            <img
                :src="CancelIcon"
                class="icon is-add"
                data-size="xs"
                alt="reset search"
            />
            <span class="visually-hidden">Reset search</span>
        </button>
    </div>

    <button v-for="image in images.value" v-on:click="selectImage(image)">
        <!-- <img class="note-image-still" :src="image.images.fixed_height_still.url" /> -->
        <img class="note-image-animated" :src="image.images.fixed_height.url" />
    </button>

    <button v-if="images.value && !endOfResults" class="btn" v-on:click="searchGiphy()">
        more
    </button>
</template>

<script setup>
    import { reactive, ref, toRefs } from 'vue';
    import { useDebounceFn } from '@vueuse/core';
    import CancelIcon from '@/assets/icons/cross.svg';
    import SearchIcon from '@/assets/icons/search.svg';

    const props = defineProps({
        visible: Boolean,
        label: String,
        id: String,
        callback: Function,
    });

    let images = reactive([]);
    let searchTerm = ref('');
    let loading = ref(false);
    const pageSize = 10;
    let offset = 0;
    let endOfResults = ref(false);

    import { useGiphy } from '@/api/useGiphy';

    function searchGiphy(e) {
        if (searchTerm.value.length >= 2) {
            useDebounceFn(async () => {
                loading.value = true;
                const response = await useGiphy(searchTerm.value, pageSize, offset);

                if (response.data && response.data.length) {
                    images.value
                        ? (images.value = [...images.value, ...response.data])
                        : (images.value = response.data);
                }
                offset += pageSize;
                loading.value = false;

                if (response.pagination.total_count < pageSize * offset) {
                    endOfResults.value = true;
                }
            }, 300)();
        } else {
            resetSearch();
        }
    }

    function resetSearch() {
        images.value = [];
        offset = 0;
    }

    // async function loadMore() {
    //     loading.value = true;
    //     offset += pageSize;
    //     console.log('next ', searchTerm.value, pageSize, offset);
    //     const response = await useGiphy(searchTerm.value, pageSize, offset);
    //     console.log('response', response.data);

    //     if (response.data && response.data.length) {
    //         // images.value = [...images.value, ...response.data];

    //         images.value = response.data;

    //         // const prevImages = images.value;
    //         // console.log('prevImages', prevImages.length);
    //         // const combinedImages = prevImages.concat(response.data);
    //         // console.log('combinedImages', combinedImages.length);
    //         // images.value = combinedImages;
    //         // console.log('updated images', images.value.length);
    //     }

    //     loading.value = false;
    // }

    const { callback } = toRefs(props);
    function selectImage(image) {
        resetSearch();
        callback.value(image);
    }
</script>
