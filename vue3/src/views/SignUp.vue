<template>
    <main class="pg-signup cols">
        <form @submit="handleSubmit" class="form-signup card col">
            <header class="card-header">Sign up</header>

            <label for="firstName">first name:</label>
            <input id="firstName" type="firstName" v-model="fields.firstName" required />

            <label for="lastName">last name:</label>
            <input id="lastName" type="lastName" v-model="fields.lastName" required />

            <label for="displayName">display name / signature:</label>
            <input
                id="displayName"
                type="displayName"
                v-model="fields.displayName"
                autocomplete="username"
                required
            />

            <label for="email">email:</label>
            <input
                id="email"
                type="email"
                v-model="fields.email"
                autocomplete="email"
                required
            />

            <!-- <Error  /> -->

            <label for="password">password:</label>
            <input
                id="password"
                type="password"
                v-model="fields.password"
                autocomplete="new-password"
                required
            />

            <label for="confirmPassword">confirm password: </label>
            <input
                id="confirmPassword"
                type="password"
                v-model="fields.confirmPassword"
                autocomplete="new-password"
                required
            />
            <!-- <Error name="password" class="error-feedback" /> -->

            <button class="btn" type="submit">create account</button>
        </form>
        <aside class="sidebar">
            <div
                v-if="invitedBy"
                class="note is-invitation width-small"
                :style="`background-image: url(${InvitationBg}); margin-bottom: var(--space);`"
            >
                <header class="note-header">
                    <TapeImage />
                </header>
                <div class="note-message">
                    <Avatar :userData="invitedBy" />
                    <br />
                    <h4 class="invitation-heading">
                        Invited by
                        <strong>{{ invitedBy.displayName }}</strong>
                    </h4>
                    <hr />
                </div>
            </div>
            <div
                class="card"
                :style="`background-image: url(${WelcomeBg}); background-size: cover;`"
            >
                <p class="p-lg">
                    Want to send a note or an image to a friend without endless adverts,
                    videos, or being spied on? This is the place! We hope you like it.
                </p>
            </div>
        </aside>
        <aside class="sidebar">
            <div class="card is-alt align-top width-small" to="/login">
                <PinImage />
                <h4>Already have an account?</h4>
                <p><RouterLink to="/login">Log in here </RouterLink></p>
            </div>
        </aside>
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Welcome to Pushpin');

    import InvitationBg from '@/assets/images/palm300.jpg';
    import WelcomeBg from '@/assets/images/stickynote-red.svg';
    import TapeImage from '@/components/images/Tape.vue';
    import PinImage from '@/components/images/Pin.vue';

    import { ref, reactive } from 'vue';
    import { useUserStore } from '@/stores/user';
    import Avatar from '@/components/Avatar.vue';

    const userStore = useUserStore();

    import { useRoute } from 'vue-router';
    const route = useRoute();
    let invitationCode = route.params.id;
    let invitedBy = reactive(null);

    if (invitationCode) {
        invitedBy = await userStore.invitationSender(invitationCode);
    }

    const fields = reactive({
        firstName: null,
        lastName: null,
        displayName: null,
        email: null,
        password: null,
        confirmPassword: null,
    });

    const errors = {
        firstName: null,
        lastName: null,
        displayName: null,
        email: null,
        password: null,
        confirmPassword: null,
    };

    const comparePasswords = () => {
        if (
            fields.password &&
            fields.confirmPassword &&
            fields.password === fields.confirmPassword
        ) {
            errors.confirmPassword = null;
        } else {
            errors.confirmPassword = 'Passwords must match';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const outcome = await userStore.performSignUp(fields, invitationCode);

        if (outcome) {
            console.log(outcome);
        }
    };
</script>
