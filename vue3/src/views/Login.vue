<template>
    <main class="pg-login cols">
        <form @submit="handleSubmit" class="form-login card col">
            <header class="card-header">Log In</header>

            <label for="email">email:</label>
            <input id="email" type="email" v-model="fields.email.value" required />
            <!-- <Error  /> -->

            <label for="password"> password: </label>
            <input
                id="password"
                type="password"
                v-model="fields.password.value"
                required
            />

            <!-- <Error name="password" class="error-feedback" /> -->

            <button class="btn" type="submit">log in</button>
        </form>

        <div class="col card is-reversed align-top width-small">
            <h4>Don't have an account yet?</h4>
            <p><RouterLink to="/signup">Sign up here</RouterLink></p>
        </div>
    </main>
</template>

<script setup>
    import { ref, reactive, provide } from 'vue';
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        userStore.performLogin({
            email: fields.email.value,
            password: fields.password.value,
        });
    };
</script>
