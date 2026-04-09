# Navidrome, the music server

I don't like subscriptions, I do like collecting physical media. Most people have heard of things like Plex but Navidrome (along with Jellyfin) are free and oftentimes better solutions, albeit a bit more technical.

## Setting it up

This was my first real endeavor in self hosting. I had a bunch of CDs and physical media and needed them digitally, available anywhere.
I first needed an organized library and a future-proof method for inputting new media.

Through a shell script that uses FFmpeg's encoding options and metadata tagging, I created a metadata normalization workflow which allows Navidrome to interact with the music properly.

Data is stored on my NAS (see the relevant article), but it only acts as a source of truth. The actual data is first copied over to the SSD then read, the NAS is simply there for consistency, stability (it is RAID 3) and space. The actual syncing is done through rsync with systemd services, all declarative through Nix. I use .flac lossless compression very heavily, to save as much space as possible.

## Last.fm API

For "scrobbles" (music tracking, think Spotify Wrapped), Navidrome interfaces with the Last.fm API. All relevant secrets are stored encrypted (but PUBLICLY) in my Git repo, thanks to Agenix.

