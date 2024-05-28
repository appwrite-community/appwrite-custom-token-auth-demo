import { Client, Account } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

const endpoint = PUBLIC_APPWRITE_ENDPOINT;
const projectId = PUBLIC_APPWRITE_PROJECT_ID;

const client = new Client()
	.setEndpoint(endpoint) // Your API Endpoint
	.setProject(projectId); // Your project ID;

export const account = new Account(client);
