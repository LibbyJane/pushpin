<template>
    <h1>icon name: {{ iconName }}</h1>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        :aria-labelledby="iconName"
        role="presentation"
        :class="`icon is-${iconName}`"
    >
        <title :id="iconName" lang="en">{{ iconName.value }} icon</title>
        <use :href="getImageUrl(iconName)" :xlinkHref="getImageUrl(iconName)" />
        <!-- <g :fill="iconColor">
            <template src="./src/assets/icons/${iconName}.svg"></template>
        </g> -->
    </svg>
</template>

<script setup>
    const icons = import.meta.globEager('./icons/*.vue');

    import { defineComponent, defineAsyncComponent, computed, ref, toRefs } from 'vue';

    //import dynamicImport from 'vite-plugin-dynamic-import';

    const props = defineProps({
        iconName: {
            type: String,
            default: 'Star',
        },
        width: {
            type: [Number, String],
            default: 18,
        },
        height: {
            type: [Number, String],
            default: 18,
        },
        iconColor: {
            type: String,
            default: 'currentColor',
        },
    });

    const { iconName, width, height, iconColor } = toRefs(props);
    console.log('what dis', iconName, width, height, iconColor);
    function getImageUrl(id) {
        console.log(
            'wat dis 2',
            new URL(`../../src/components/icons/${iconName.value}.vue`, import.meta.url)
                .href
        );
        return new URL(
            `../../src/components/icons/${iconName.value}.vue`,
            import.meta.url
        ).href;
    }
    // const iconGuts = computed(() => {
    //     return defineAsyncComponent(() => import(`./icons/${iconName}.vue`));
    // });

    // function getPaths(iconName) {
    //     return import(`./src/assets/icons/${iconName}.svg`);
    // }
</script>
