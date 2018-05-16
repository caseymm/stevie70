import json
# import requests
import sys
import spotipy
import spotipy.util as util

username = '12554783'
scope = 'user-library-modify'
token = util.prompt_for_user_token(username, scope)

sp = spotipy.Spotify(auth=token)

with open('stevie_nicks_albums.json') as json_data:
    data = json.load(json_data)
    big_dict = {}
    for album in data['items']:
        if int(album['release_date'].split('-')[0]) > 1974:
            # print album['id']
            a_tracks = sp.album_tracks(album['id'], limit=50, offset=0)
            if a_tracks['total'] > 8:
                # print album['name']
                # print album['release_date']
                disc_num = 1
                # with open('albums/'+'_'.join(album['name'].split(' '))+'.json', 'w') as f:
                #     json.dump(a_tracks, f)
                tmp = {}
                ids = []
                for t in a_tracks['items']:
                    if t['disc_number'] <= disc_num:
                        # t['preview_url']
                        # print t['name'], t['id']
                        t.pop('available_markets', None)
                        tmp[t['id']] = t
                        ids.append(t['id'])

                audio_features = sp.audio_features(tracks=ids)
                for tf in audio_features:
                    c_item = tmp[tf['id']]
                    for f in tf:
                        # print f, tf[f]
                        c_item[f] = tf[f]

                for i in tmp:
                    big_dict.setdefault(album['name'], []).append(tmp[i])

                with open('stevie_master.json', 'w') as f:
                    json.dump(big_dict, f)
