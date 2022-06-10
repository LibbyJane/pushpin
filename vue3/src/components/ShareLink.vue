<template>
    <ul class="share-link">
        <li v-for="domain in domains">
            <a :href="domain.url" target="_blank">
                <img
                    :src="getImageUrl(domain.icon)"
                    class="icon"
                    :alt="`send via ${domain.id}`"
                />
                <span class="visually-hidden"> {{ domain.id }}</span></a
            >
        </li>
    </ul>
</template>

<script setup>
    import { toRefs } from 'vue';
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const user = userStore.getInfo;

    const props = defineProps({
        url: {
            type: String,
        },
    });

    const { url } = toRefs(props);

    const domains = [
        {
            url: `mailto:?subject=Join%20${user.displayName}%20on%20PushPin&body=Use this url to get%20started%20-%20${url.value}`,
            id: 'email',
            icon: 'envelope3',
        },
        {
            url: `https://api.whatsapp.com/send?text=${url.value}`,
            id: 'whatsapp',
            icon: 'logo-whatsapp',
        },
        {
            url: `https://t.me/share/url?url=${url.value}`,
            id: 'telegram',
            icon: 'logo-telegram',
        },
    ];

    function getImageUrl(id) {
        return new URL(`../../src/assets/icons/${id}.svg`, import.meta.url).href;
    }
</script>

<style lang="scss">
    .share-link {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        li {
            margin: 0;
            padding: var(--space-sm);
            padding-top: 0;
        }
    }
</style>
