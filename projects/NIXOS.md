# My NixOS (ankhnix)

Realizing a long struggle with lack of reproducibility and "it works on my system" headaches, I came across NixOS. My Codeberg repo has grown massive, me essentially being the sole programmer (and member) of the project, in its programming language, Nix. 

## Problems encountered

Documentation is lacking, but having to troubleshoot so, so many things gave me a significantly bigger understanding of Linux sysadmin work. Additionally, Nix's nature of being essentially an entire system defined in code, no imperative commands, means it interacts wonderfully with LLMs. All their output now becomes verifiable, as if they hallucinate something, the system simply won't build as Nix finds the error. Additionally, troubleshooting becomes easier as the LLM has access to the system's entire state through the Nix repo.

## Expanding

Initially, I used Debian (and then Arch Linux) on my home server, due to my long experience with both. However, the reproducibility of Nix encouraged me to expand. My system flake has now grown to a three-host config, covering my personal desktop, my work laptop AND homeserver all in one.

On the server, reproducibility is one thing, but rollbacks are even more of a godsend. If my system ever breaks, I have access to every generation that was built prior. This is effectively infinite stability, I cannot overstate how many times this has saved me (and my sole other user, my girlfriend).

## Secrets

My PUBLIC repo also stores secrets like my SSH keys, NAS passwords, usernames, and many others. How? Agenix is a wonderful flake that I've implemened that allows encrypting secrets in my Nix repo with age, and are decrypted at boot with an age key stored at /etc/age/key.txt. Additionally, for things such as passwords (that require one way encryption only, i.e. hashing), we can encrypt the hash with age to prevent fingerprinting and such.

## Development

Reproducible dev environments are a godsend. Nix allows pinning exact toolchains and dependencies. Not just a list of dependencies, exact versions used. This is effectively the biggest source of "works on my machine" headaches in traditional development, completely gone with Nix.

## Results

I can now essentially "infect" (as the Nix community might call it) any computer with my very, very specific desktop configuration, all my programs, my shortcuts, workflow, browser addons and everything within minutes. The only manual setup that is left is logging into accounts. This has had the effect of standardizing my workflow across my laptop and desktop, with an identical experience.
