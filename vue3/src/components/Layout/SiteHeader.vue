<template>
    <header class="site-header container">
        <div class="content">
            <RouterLink class="site-logo" to="/">
                <img src="{Logo}" alt="logo" />
            </RouterLink>

            <!--  <h1 class="page-title">{headerTitle}</h1> -->
        </div>

        <nav class="user-nav">
            <ul>
                <li
                    class="nav-create"
                    data-tip="Send a note"
                    data-for="tt-send"
                    data-background-color="var(--biro)"
                >
                    <!-- <RouterLink to="/create">
                        <img class="icon" src="{CreateIcon}" alt="Click to send a note" />
                    </RouterLink> -->
                </li>
                <li
                    class="nav-account"
                    data-tip="Your account"
                    data-for="tt-account"
                    data-background-color="var(--biro)"
                >
                    <!-- <RouterLink to="/account">
                         {user.id && <Avatar id={user.id} />}
                    </RouterLink> -->
                </li>
                <li
                    class="nav-logout"
                    data-tip="Log out"
                    data-for="tt-logout"
                    data-background-color="var(--biro)"
                >
                    <!-- <RouterLink type="button" onClick="{logout}">
                      <img class="icon" src={LogoutIcon} alt="logout icon" />
                        <span class="visually-hidden">Log out</span>
                    </RouterLink>
                </li> -->
                </li>
            </ul>

            <!-- <ReactTooltip id="tt-send" class="tooltip" />
                    <ReactTooltip id="tt-account" class="tooltip" />
                    <ReactTooltip id="tt-logout" class="tooltip" /> -->
        </nav>

        <nav class="site-nav">
            <ul>
                <li><RouterLink to="/login">Login</RouterLink></li>
                <li><RouterLink to="/signup">Signup</RouterLink></li>
            </ul>
        </nav>
    </header>
</template>
