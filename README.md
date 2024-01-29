# NowPlayingBadge

![NowPlayingBadge](https://img.shields.io/endpoint?url=https://nowplayingbadge.vercel.app/api/spotify)

## Overview

NowPlayingBadge is a project that generates a dynamic SVG badge displaying your current Spotify playing status. The badge provides information about the currently playing song on your Spotify account.

## Getting Started

Follow these steps to set up and run the project:

1. **Create a Spotify Account:**
   Create a Spotify account if you don't have one. 

2. **Spotify Developer Dashboard:**
   Log into the [Spotify Developer Dashboard](https://developer.spotify.com/) and create a new app. Retrieve the `Client ID` and `Client Secret` from the app settings.

3. **Generate Spotify Refresh Token:**
   Generate your Spotify refresh token using [Spotify Refresh Token Generator Online](https://spotify-refresh-token-generator.netlify.app/#welcome).

4. **Install Dependencies:**
   Run the following command in the root directory to install project dependencies:
   ```bash
   npm install
   ```
5. **Create Environment Variables:**
   Create a .env file in the root of the project directory with the following content:
   ```
   SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID
   SPOTIFY_CLIENT_SECRET=YOUR_CLIENT_SECRET
   SPOTIFY_REFRESH_TOKEN=YOUR_REFRESH_TOKEN
   ```

6. **Run the Project:**
   Start the project by running the following command:
   ```bash
   npm run dev
   ```

# NowPlayingBadge Badge
Include the generated SVG badge in your project README to display your current Spotify playing status. Use the following markdown code:
```
![NowPlayingBadge](https://img.shields.io/endpoint?url={YOUR_SITE_URL}/api/spotify)

```
