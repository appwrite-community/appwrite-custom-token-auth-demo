# Appwrite Custom Token Auth Demo

Demo to showcase how custom token auth works in Appwrite

## Environment variables

This app needs the following environment variables

- `PUBLIC_APPWRITE_ENDPOINT`: Endpoint of your Appwrite project  
- `PUBLIC_APPWRITE_PROJECT_ID`: Project ID of your Appwrite project  
- `APPWRITE_API_KEY`: API key from your Appwrite project with the following scopes enabled: `users.read` and `users.write`

## Testing the app

Once you've clone the project, installed dependencies with `npm install` and created a `.env` file with the appropriate variables, run the following command in your terminal

```sh
npm run dev
```