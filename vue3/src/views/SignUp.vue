<template>
    <main class="pg-signup cols">
        <form @submit="handleSubmit" class="form-signup card col">
            <header class="card-header">Sign up</header>

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

            <label for="confirmPassword">confirm password: </label>
            <input
                id="confirmPassword"
                type="password"
                v-model="fields.confirmPassword.value"
                required
            />
            <!-- <Error name="password" class="error-feedback" /> -->

            <button type="submit">create account</button>
        </form>

        <div class="col card is-reversed align-top width-small">
            <h4>Already have an account?</h4>
            <p><RouterLink to="/login">Log in here</RouterLink></p>
        </div>
    </main>
</template>

<script setup>
    import { ref, reactive, provide } from 'vue';
    import { useAPI } from '@/api/useAPI';
    import { useUserStore } from '@/stores/user';

    const userStore = useUserStore();

    const fields = reactive({
        email: {
            value: 'cookie@monster.com',
            error: null,
        },
        password: {
            value: 'testtest',
        },
        confirmPassword: {
            value: 'testtest',
            error: null,
        },
    });

    // watch(
    //     fields.password.value: () => {
    //         comparePasswords()
    //     },

    //     fields.confirmPassword.value: () => {
    //         comparePasswords()
    //     }
    // );

    const comparePasswords = () => {
        if (
            fields.password.value &&
            fields.confirmPassword.value &&
            fields.password.value !== fields.confirmPassword.value
        ) {
            fields.confirmPassword.error = 'Passwords must match';
            console.log('error', fields.confirmPassword.error);
        } else {
            fields.confirmPassword.error = null;
            console.log('no error', fields.confirmPassword.error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await useAPI('login', {
            email: fields.email.value,
            password: fields.password.value,
        });

        if (response.data) {
            userStore.updateAuth(data.tokenInfo);
            userStore.updateInfo(data.user);
            console.log(userStore.getAuth.token, userStore.getInfo);
        } else if (response.error) {
            console.log(response.error);
        }
    };
</script>
