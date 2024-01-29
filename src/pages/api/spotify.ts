import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET'],
});

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const token = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

interface SpotifyData {
  is_playing: boolean;
  item: {
    name: string;
    album: {
      name: string;
      artists: Array<{ name: string }>;
      images: [{ url: string }];
    };
    external_urls: {
      spotify: string;
    };
  };
  currently_playing_type: string;
}

const getAccessToken = async () => {
  const res = await axios.post<{ access_token: string }>(
    TOKEN_ENDPOINT,
    querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    {
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.data.access_token;
};

const getNowPlaying = async () => {
  const access_token = await getAccessToken();

  return axios.get<SpotifyData>(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const next = () => {};
  await cors(req, res, next);

  if (req.method === 'GET') {
    try {
      const response = await getNowPlaying();

      if (
        response.status === 204 ||
        response.status > 400 ||
        response.data.currently_playing_type !== 'track'
      ) {
        const badgeData = {
          schemaVersion: 1,
          label: 'Now Playing',
          message: 'Not Listening',
          color: 'inactive',
          logo: 'spotify',
        };

        res.setHeader(
          'Cache-Control',
          'public, s-maxage=180, stale-while-revalidate=90'
        );
        return res.status(200).json(badgeData);
      }

      const badgeData = {
        schemaVersion: 1,
        label: 'Now Playing',
        message: `${response.data.item.name} by ${response.data.item.album.artists
          .map((artist) => artist.name)
          .join(', ')}`,
        color: 'brightgreen',
        logo: 'spotify',
        logoColor: 'white',
        logoWidth: 20, // Adjust the logo size as needed
        style: 'flat-square',
        albumImageUrl: response.data.item.album.images[0].url,
      };

      res.setHeader(
        'Cache-Control',
        'public, s-maxage=180, stale-while-revalidate=90'
      );
      return res.status(200).json(badgeData);
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
