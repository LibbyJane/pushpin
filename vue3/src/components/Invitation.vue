<template>
    <RouterLink
        to="invite"
        type="button"
        class="note is-invitation"
        :style="`background-image: url(${Invitation})`"
    >
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
    import Invitation from '@/assets/images/palm396.jpg';
    import Paper from '@/assets/images/Paper.jpg';
    import PinImage from '@/components/images/Pin.vue';
</script>
