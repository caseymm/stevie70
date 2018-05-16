import json
# import requests
import sys
import spotipy
import spotipy.util as util

username = '12554783'
scope = 'user-library-modify'
token = util.prompt_for_user_token(username, scope)

sp = spotipy.Spotify(auth=token)

big_dict = {}

with open('fleetwood_albums.json') as json_data:
    data = json.load(json_data)
    for album in data['items']:
        if int(album['release_date'].split('-')[0]) > 1974:
            a_tracks = sp.album_tracks(album['id'], limit=50, offset=0)
            if a_tracks['total'] > 8:
                disc_num = 1
                if album['name'].split('-')[0] == 'Tusk':
                    disc_num = 2
                tmp = {}
                ids = []
                for t in a_tracks['items']:
                    if t['disc_number'] <= disc_num:
                        t.pop('available_markets', None)
                        tmp[t['id']] = t
                        ids.append(t['id'])

                tracks = sp.tracks(tracks=ids)
                # print tracks
                for tf in tracks['tracks']:
                    print tf['id'], tf['name'], tf['popularity']
                    big_dict[tf['id']] = {
                        'name': tf['name'],
                        'pop': tf['popularity']
                    }

with open('stevie_nicks_albums.json') as json_data:
    data = json.load(json_data)
    for album in data['items']:
        if int(album['release_date'].split('-')[0]) > 1974:
            a_tracks = sp.album_tracks(album['id'], limit=50, offset=0)
            if a_tracks['total'] > 8:
                disc_num = 1
                if album['name'].split('-')[0] == 'Tusk':
                    disc_num = 2
                tmp = {}
                ids = []
                for t in a_tracks['items']:
                    if t['disc_number'] <= disc_num:
                        t.pop('available_markets', None)
                        tmp[t['id']] = t
                        ids.append(t['id'])

                tracks = sp.tracks(tracks=ids)
                # print tracks
                for tf in tracks['tracks']:
                    print tf['id'], tf['name'], tf['popularity']
                    big_dict[tf['id']] = {
                        'name': tf['name'],
                        'pop': tf['popularity']
                    }

                with open('all_tracks_master.json', 'w') as f:
                    json.dump(big_dict, f)
