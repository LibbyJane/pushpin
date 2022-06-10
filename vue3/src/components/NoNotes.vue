<template>
    <RouterLink v-if="friends && friends.length" to="/create" class="note is-welcome">
        <header class="note-header">
            <PinImage />
        </header>
        <div class="note-image">
            <img :src="Welcome" alt="Welcome" />
        </div>
        <div class="note-message">
            <!-- <h4>Hello!</h4> -->
            <p>It looks like you don&rsquo;t have any notes to show at the moment.</p>
            <p>Would you like to <span class="btn is-text">send one?</span></p>
        </div>
    </RouterLink>

    <div v-else class="note is-welcome">
        <header class="note-header">
            <PinImage />
        </header>
        <div class="note-image">
            <img :src="Welcome" alt="Welcome" />
        </div>
    </div>

    <Invitation />

    <RouterLink
        v-if="userInfo && userInfo.imageURL === null"
        to="/account"
        class="note is-update-profile"
    >
        <header class="note-header">
            <img class="tape" :src="Tape" alt="Tape" />
            <img class="tape" :src="Tape" alt="Tape" />
        </header>
        <Avatar />
        <div class="note-message">
            <h6><strong>Add an image to your profile?</strong></h6>
            <p>It helps your friends see which notes you've sent them.</p>
        </div>
    </RouterLink>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/stores/user';
    import Invitation from '@/components/InvitationNote.vue';
    import Avatar from '@/components/Avatar.vue';
    import Welcome from '@/assets/images/welcome.svg';
    import DefaultAvatarImage from '@/assets/icons/person.svg';
    import Paper from '@/assets/images/Paper.jpg';
    import PinImage from '@/components/images/Pin.vue';
    import Tape from '@/assets/images/Tape.svg';

    const userStore = useUserStore();
    const storeRef = storeToRefs(userStore);
    const userInfo = storeRef.getInfo;
    const friends = storeRef.getFriends;
</script>
