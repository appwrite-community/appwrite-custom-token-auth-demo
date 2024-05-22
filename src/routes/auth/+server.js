import { Client, Users, ID, Query } from "node-appwrite";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from "$env/static/public";
import { env } from "$env/dynamic/private";

const endpoint = PUBLIC_APPWRITE_ENDPOINT;
const projectId = PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = env.APPWRITE_API_KEY;

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const users = new Users(client);

async function checkIfUserExists(email) {
    try {
        let usersList = await users.list([ Query.equal('email', email) ]);
        if (usersList.total != 0) {
            return usersList.users[0];
        } else {
            return await users.create(ID.unique(), email);
        }
    } catch (err) {
        console.error(err);
    }
    
}

async function authLogic(email, password) {
    // You can have any auth logic here
    if (password === '123456') {
        return await checkIfUserExists(email);
    }
    return false;
}

export async function POST({ request }) {
    try {
        const requestBody = await request.json();
        const email = requestBody.email;
        const password = requestBody.password;

        let user = await authLogic(email, password);

        if(user) {
            let token = await users.createToken(user.$id);

            return new Response(JSON.stringify({ user, token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } catch(err){
        console.error(err);
        return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}