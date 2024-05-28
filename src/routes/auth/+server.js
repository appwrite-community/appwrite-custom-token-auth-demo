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

/**
 * Returns user if user exists in Appwrite, if not creates a new user
 * 
 * @param {string} email
 * @returns {Promise<import("node-appwrite").Models.User>} user
 */
async function getUser(email) {
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

/**
 * Logic for authentication
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import("node-appwrite").Models.User>} user
 */
async function authLogic(email, password) {
    try {
        // You can have any auth logic here. For the example, we're only matching the password with '123456'
        if (password === '123456') {
            return await getUser(email);
        }
    } catch (err) {
        console.error(err);
    }
}

export async function POST({ request }) {
    try {
        const requestBody = await request.json();
        const email = requestBody.email;
        const password = requestBody.password;

        // Call the auth logic
        let user = await authLogic(email, password);

        // If user exists, create a token
        if(user) {
            let token = await users.createToken(user.$id);

            // Ideally, you should not send the token object in response. Send the token secret to the user through an alternative secure channel
            return new Response(JSON.stringify({ user, token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } catch(err){
        console.error(err);
        return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}