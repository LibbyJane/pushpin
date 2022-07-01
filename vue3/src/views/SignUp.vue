<template>
    <main class="pg-signup cols">
        <form @submit="handleSubmit" class="form-signup card col">
            <img
                src="@/assets/images/pin-round-peach.png"
                class="card-pin"
                alt="Push Pin"
            />
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
                v-on:blur="comparePasswords"
                autocomplete="new-password"
                required
            />

            <label for="confirmPassword">confirm password: </label>
            <input
                id="confirmPassword"
                type="password"
                v-model="fields.confirmPassword"
                v-on:blur="comparePasswords"
                autocomplete="new-password"
                required
            />
            <Error v-if="errors.confirmPassword" :message="errors.confirmPassword" />
            <Error v-if="formError" :message="formError" />
            <button class="btn" type="submit" :disabled="submitDisabled">
                create account
            </button>
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
                class="card white-inner"
                :style="`background-image: url(${WelcomeBg}); `"
            >
                <img
                    src="@/assets/images/pin-round-teal.png"
                    class="card-pin"
                    alt="Push Pin"
                />
                <p class="p-lg">
                    Want to send a note or an image to a friend without endless adverts,
                    videos, or being spied on? This is the place! We hope you like it.
                </p>
            </div>
        </aside>
        <aside class="sidebar">
            <div class="card is-alt align-top width-small" to="/login">
                <img src="@/assets/images/tape.svg" class="card-tape" alt="Push Pin" />
                <h4>Already have an account?</h4>
                <p><RouterLink to="/login">Log in here </RouterLink></p>
            </div>
        </aside>
    </main>
</template>

<script setup>
    import InvitationBg from '@/assets/images/palm300.jpg';
    import WelcomeBg from '@/assets/images/pattern300.jpg';
    import TapeImage from '@/components/images/Tape.vue';

    import Error from '@/components/Error.vue';
    import { useRoute } from 'vue-router';
    import { ref, reactive } from 'vue';
    import { useUserStore } from '@/stores/user';
    import Avatar from '@/components/Avatar.vue';

    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Welcome to Pushpin');

    const userStore = useUserStore();

    const route = useRoute();
    let invitationCode = route.params.id;
    let invitedBy = invitationCode
        ? reactive(await userStore.invitationSender(invitationCode))
        : null;

    // const fields = reactive({
    //     firstName: '',
    //     lastName: '',
    //     displayName: '',
    //     email: '',
    //     password: '',
    //     confirmPassword: '',
    // });

    const fields = reactive({
        firstName: 'test5',
        lastName: 'test',
        displayName: 'test5',
        email: 'test5@test.com',
        password: 'testtest',
        confirmPassword: '',
    });

    const errors = reactive({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    let formError = ref('');
    let submitDisabled = ref(false);

    const comparePasswords = () => {
        console.log(
            'comparing',
            fields.password.length,
            fields.confirmPassword.length,
            fields.password === fields.confirmPassword
        );
        if (
            fields.password.length &&
            fields.confirmPassword.length &&
            fields.password !== fields.confirmPassword
        ) {
            errors.confirmPassword = 'Passwords must match';
        } else {
            errors.confirmPassword = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formHasErrors = false;

        submitDisabled.value = true;

        for (const [key, value] of Object.entries(errors)) {
            if (value.length) {
                formHasErrors = true;
                break;
            }
        }

        if (!formHasErrors) {
            const outcome = await userStore.performSignUp(fields, invitationCode);

            if (outcome.error) {
                formError.value = outcome.error;
            } else if (outcome.errors) {
                for (let error of outcome.errors) {
                    formError.value += `${error}`;
                }
            }
        }

        submitDisabled.value = false;
    };
</script>
