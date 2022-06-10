import { onMounted, onUpdated } from 'vue';
import { useSiteStore } from '@/stores/site';



export function usePageTitle(string) {
    const siteStore = useSiteStore();
    console.log('use page title', string);
    onUpdated(() => siteStore.pageTitle = string);
    onMounted(() => siteStore.pageTitle = string)
}