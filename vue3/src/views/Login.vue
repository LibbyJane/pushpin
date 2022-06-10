<template>
    <main class="pg-login cols">
        <form @submit="handleSubmit" class="form-login card col">
            <header class="card-header">Log In</header>

            <label for="email">email:</label>
            <input
                id="email"
                type="email"
                v-model="fields.email.value"
                v-on:keyup="clearError"
                autocomplete="email"
                required
            />
            <!-- <Error  /> -->

            <label for="password"> password: </label>
            <input
                id="password"
                type="password"
                v-model="fields.password.value"
                v-on:keyup="clearError"
                autocomplete="current-password"
                required
            />
            <Error v-if="formError" :message="formError" />

            <button class="btn" type="submit">log in</button>
        </form>

        <aside class="sidebar">
            <div class="card is-alt align-top width-small" to="/login">
                <h4>Don't have an account yet?</h4>
                <p><RouterLink to="/signup">Sign up here</RouterLink></p>
            </div>
        </aside>
    </main>
</template>

<script setup>
    import { usePageTitle } from '@/use/usePageTitle';
    usePageTitle('Log in');

    import Error from '@/components/Error.vue';

    import { ref, reactive } from 'vue';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();

    const fields = reactive({
        email: {
            value: null,
            error: null,
        },
        password: {
            value: null,
            error: null,
        },
    });

    let formError = ref('');

    const clearError = () => {
        // fields[fieldKey].error = null;
        formError.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        formError.value = await userStore.performLogin({
            email: fields.email.value,
            password: fields.password.value,
        });
    };
</script>
