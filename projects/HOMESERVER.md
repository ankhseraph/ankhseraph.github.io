# The e-Waste Homeserver

I found an old 2013 HP laptop lying around the house. No one was using it, essentially e-waste. The magic of Linux is being able to revive really old computers like it.I installed Debian, then Arch Linux, then finally NixOS. Here's what it took, what tools are used, and what I learned.

## The scope

Running on a measly 4GB ram and a realy, really old 4-thread processor, I had make every decision about this OS with intention. The swap, the talk about zram/zswap, filesystems, I/o bottlenecks, the virtualization overhead especially since it runs Docker (later discussed), and much more.

## The challenges

Firstly, the server had to store a lot of data, given my music library is ~100GB alone, and will constantly grow. Together with my NAS, this could be done, but hard drives being notoriously slow, I had to work with a hybrid solution. The NAS acts as a source of truth while the SSD is a make-shift cache. This lets me make use of high speeds while also having terabytes of storage. But every gigabyte of that cache would be extremely valuable, hence, I needed to make my entire system as tiny as possible, and as efficient as possible. Considering the options, I opted for old-reliable ext4 fs and spent a good amount of time trimming the fat off the OS. I am now left with ~10GB taken up by everything combined, Docker containers, an operating system, monitoring tools, yadda yadda.

## Tools used

The actual server is, essentially, a NixOS flake that runs Dockerized containers:  Navidrome for music, SearXNG for private search, Vaultwarden for passwords, Filebrowser for NAS access, and Portainer for ops. Public exposure is handled via Cloudflared tunnels, while a small Python/Flask API handles remote music ingestion. Everything is backed by scheduled rsync backups to a NAS, plus a 15‑minute NAS→SSD sync to keep the media cache fast. Networking is VPN‑first with a tight firewall, and secrets are managed through agenix env‑files.

## Safety

This is where NixOS shines. If the Nix server ever catches on fire and burns, well, then, unless Codeberg servers also catch on fire and burn, I have a public Git repo that handles all things, including secrets, and my NAS which hosts backup of operational files (/var/lib mainly). I encrypt the operational files and store them in my Cloud storage provider of choice, this means I have essentially 2 cloud backups and 2 physical backups. My data isn't really going anywhere.
