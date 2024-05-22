<script>
    import { Client, Account } from "appwrite";
    import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from "$env/static/public";

    const endpoint = PUBLIC_APPWRITE_ENDPOINT;
    const projectId = PUBLIC_APPWRITE_PROJECT_ID;

    const client = new Client()
        .setEndpoint(endpoint) // Your API Endpoint
        .setProject(projectId); // Your project ID;

    const account = new Account(client);

    let session = '';
    let token = '';

    async function login(e) {
        try {
            e.preventDefault();
            
            let formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');

            let authRequest = await fetch('/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            let authRequestBody = await authRequest.json();

            token = authRequestBody.token;

            session = await account.createSession(authRequestBody.user.$id, authRequestBody.token.secret);
            
        } catch (error) {
            console.error(error);
        }
    }

    async function logout() {
        token = '';
        session = '';
        await account.deleteSession('current');
    }
</script>

<section>
    <h1>Appwrite Custom Token Demo</h1>
    <div class="notLoggedIn">
        <form on:submit={login}>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter email" value="aditya@example.com" required>
            <label for="password">Password:</label>
            <input type="text" id="password" name="password" placeholder="Enter code: 123456" value="123456" required>
            <button type="submit">Login</button>
        </form>
    </div>
    
    <div class="loggedIn">
        <h2>Token details:</h2>
        <p>{JSON.stringify(token)}</p>
        <h2>Session details:</h2>
        <p>{JSON.stringify(session)}</p>
        <button type="submit" on:click={logout}>Logout</button>
    </div>
</section>


<style>
    section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    form {
        gap: 1rem;
        display: flex;
        flex-direction: column;
    }

    form input {
        padding: 0.5rem;
    }

    .loggedIn {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .loggedIn p {
        padding: 0.5rem 1rem;
        border: 2pm solid black;
        white-space: pre-line;
    }
</style>