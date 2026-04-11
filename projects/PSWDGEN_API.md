# pswdgen_api

CI/CD in a SSH key & password generator API through Docker and GithubActions. Runs through Docker, absurdly lightweight naturally. I found it really fun to build as I find working with cryptography super interesting and rewarding. I opted for FastAPI for the actual API backend as it's more modern and I figured the experience would be more useful than older solutions. If I could remake it from the gruond up, I think I would broaden the scope of the API, but nothing stops me from doing that, except the name. I do actually plan on making it function as a hashing tool as well, maybe general encryption too.

## More details

On every push, a GitHub Action runs five tests (will be six later). The two functions so far are generating passwords and SSH keys. The tests are invalid input, then establishing parameters work (naming the SSH public key, the password length, which characters should be used, yadda yadda)

I am planning and I am expecting to have a lot of fun implementing an entropy calculator for the password as well as a round-trip test for the SSH key. It's totally improbable but it would to check if the password is truly random (would only work for large numbers, 50+ length) or if there is some pattern within it.

For the SSH key, I will implement a proper SSH key usage test, which will be the true challenge. I'd also like to add a SHA output field to the SSH gen like Bitwarden currently does. There's a huge amount of potential and I expect this writeup to only grow as time goes on.
