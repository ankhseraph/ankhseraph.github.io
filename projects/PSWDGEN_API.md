# pswdgen_api

CI/CD in a SSH key & password generator API through Docker and GithubActions. Runs through Docker, absurdly lightweight naturally. I found it really fun to build as I find working with cryptography super interesting and rewarding. I opted for FastAPI for the actual API backend as it's more modern and I figured the experience would be more useful than older solutions. If I could remake it from the gruond up, I think I would broaden the scope of the API, but nothing stops me from doing that, except the name. I do actually plan on making it function as a hashing tool as well, maybe general encryption too.

## More details

On every push, a GitHub Action runs a bunch of tests. The two functions so far are generating passwords and SSH keys. The tests are invalid input, then establishing parameters work (naming the SSH public key, the password length, which characters should be used, yadda yadda)

I added an entropy calculator for the password which also estimates crack time, which was really fun to build. It checks if the password is truly random (would only work for large numbers, 50+ length) or if there is some pattern within it, totally improbable but still cool to have. The crack time estimation is a nice touch I think, gives you a sense of how strong your password actually is.

For the SSH key, I implemented a round-trip test which was the true challenge as expected. Basically it signs some data with the private key and verifies it with the public key, making sure the keypair actually works together. I'd also like to add a SHA output field to the SSH gen like Bitwarden currently does. There's a huge amount of potential and I expect this writeup to only grow as time goes on.
