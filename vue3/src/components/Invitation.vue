<template>
    <RouterLink to="invite" type="button" class="note is-invitation">
        <header class="note-header">
            <PinImage />
        </header>
        <div class="note-message">
            <h4 class="invitation-heading"><strong>Invite</strong> a&nbsp;friend</h4>
            <hr />
            <p>Make someone&rsquo;s day!</p>
        </div>
    </RouterLink>
</template>

<script setup>
    import PinImage from '@/components/images/Pin.vue';
</script>
