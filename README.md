<p align="center">
	<img src="https://i.imgur.com/VywMXTB.png" alt="weve showcase">
</p>
<h4 align="center">
	Latest beta is deployed at <a href="http://weve.email" target="_blank" rel="noopener noreferrer">weve.email</a> and in the <a href="https://github.com/Anish-Agnihotri/weve/tree/deploy-b2">deploy-b2 branch</a>. <br />The master branch is for feature development only.
</h4>

# weve.

weve is a prototype decentralized mail system, running on the [Arweave network](https://arweave.org/), according to the [Weavemail](https://github.com/ArweaveTeam/weavemail#how-is-it-built) protocol specifications, built during [New York Blockchain Week](https://gitcoin.co/hackathon/new-york-blockchain-week/).

It is deployed to the Arweave permaweb, so its messages and the web app itself are *permanent* and *always* available.

## How is it built?

weve uses the [Arweave HTTP API](https://docs.arweave.org/developers/server/http-api), [Arweave JS](https://github.com/ArweaveTeam/arweave-js), and is deployed with [Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy).

Speaking to its technical implementation, it makes extensive use of `sessionStorage` capabilities (for temporary storage of keyfiles and drafts) and [react-router-dom](https://www.npmjs.com/package/react-router-dom) for mail-client application-level routing. 

weve offers an enhanced experience over the [original Weavemail protocol implementation](https://github.com/ArweaveTeam/weavemail), by offering a variety of new features, including:
1. Simplified, familiar UI/UX
2. Session-based keyfile storage
3. Markdown-extensible message bodies.
4. Session-based mail drafts.
5. Mobile-responsiveness.

## How does it work?

*Sending messages*
1. Messages are encrypted with the recipients public key using [RSA-OAEP](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding).
2. After encrypting the message contents for the recipient, messages are packaged into an Arweave transaction, signed, tagged, and submitted to the network.

*Receiving messages*
1. ArQL is used to collect messages from the network. The query asks for transactions that are a) addressed to you and b) tagged with `App-Name: permamail`.
2. When you click on a message to view it, the transaction is pulled from the network and decrypted using your private key.

## Additional info
* [Arweave.org](https://arweave.org)
* [Weavemail](https://github.com/ArweaveTeam/weavemail)
