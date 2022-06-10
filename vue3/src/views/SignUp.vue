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
                v-if="!invitationSender"
                class="card is-reversed align-top width-small"
                to="/login"
            >
                <h4>Already have an account?</h4>
                <p><RouterLink to="/login">Log in here </RouterLink></p>
            </div>

            <div v-else>
                <Avatar :userID="invitationSender" showName="true" />
            </div>
        </aside>
    </main>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import Avatar from '@/components/Avatar.vue';
    const route = useRoute();
    const router = useRouter();
    const invitationSender = parseInt(route.params.id);

    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Welcome to Pushpin');

    import { reactive } from 'vue';
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();

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

        const response = await userStore.performRegister(fields);

        if (response.data) {
            userStore.auth = data.tokenInfo;
            userStore.info = data.user;
            console.log(userStore.getAuth.token, userStore.getInfo);
        } else if (response.error) {
            console.log(response.error);
        }
    };
</script>
