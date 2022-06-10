<template>
    <ul class="share-link">
        <li v-for="domain in domains">
            <a :href="domain.url" target="_blank">{{ domain.id }}</a>
        </li>
    </ul>
</template>

<script setup>
    import { toRefs } from 'vue';
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const user = userStore.getInfo;
    console.log('user', user);

    const props = defineProps({
        url: {
            type: String,
        },
    });

    const { url } = toRefs(props);

    const domains = [
        {
            url: `mailto:?subject=Join%20${user.displayName}%20on%20PushPin&body=Get%20started%20${url.value}`,
            id: 'email',
        },
        {
            url: `https://m.me/share/url?url=${url.value}`,
            id: 'facebook',
        },
        {
            url: `https://twitter.com/share?url=${url.value}`,
            id: 'twitter',
        },
        {
            url: `https://api.whatsapp.com/send?text=${url.value}`,
            id: 'whatsapp',
        },
        {
            url: `https://t.me/share/url?url=${url.value}`,
            id: 'telegram',
        },
    ];
</script>
