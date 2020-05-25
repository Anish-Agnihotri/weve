<p align="center">
	<img src="https://i.imgur.com/VywMXTB.png" alt="weve showcase">
</p>
<h4 align="center">
	Latest beta is deployed at <a href="http://weve.email" target="_blank" rel="noopener noreferrer">weve.email</a> and in the <a href="https://github.com/Anish-Agnihotri/weve/tree/deploy-b5">deploy-b5 branch</a>. <br />The master branch is for feature development only.
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

## Goals
1. The first goal for this bounty was to **build your own version of a WeaveMail client**. My submission is a completely new and improved platform built keeping in mind the basic principles of the WeaveMail protocol (and complete backwards compatibility), and catering to an audience coming from a Web 2.0 background. The client **significantly improves loading messages speed**, and the UI is **new** and **fully mobile-responsive**.
2. The second goal for this bounty was in regards to the **WeaveMail UI**. Weve has been built from scratch, using no external UI/CSS frameworks (in pursuit of reduced dependencies and fast loading). It is built adhering to modern ReactJS practices, and the UI/UX emulates that of a conventional email client (to simplify on-boarding for new users and those familiar with Web 2.0 email clients).
3. The third goal for this bounty was in regards to **incorporating existing features and new features**. Weve is a fully-backwards-compatible client implementation, meaning it works with the original [WeaveMail application](https://weavemail.app) without a hitch. All existing functionality of the original WeaveMail client has been implemented. In addition to existing functionality, **significant additional functionality has been added**, as discussed in the Highlighted Features section.
4. The fourth goal for this bounty was in regards to **deployment on the permaweb**. Weve has been deployed to the permaweb for ~a week now, and is accessible at [http://weve.email](http://weve.email).

# Hackathon criteria

 - [X] Submissions must be your original work.
 - [X] Previously published dApps aren't eligible to participate in this bounty.
 - [X] You must make your full source code available over Github and it needs to include an OSS license. Which one is up to you.
 - [X] Complete all the goals set in the Goals section.

## Highlighted Features
1. Simplified/familiar UI/UX.
![Simplified UX](https://i.imgur.com/uVV7KMb.png)
2. Session-based keyfile storage.
![Session-based keyfile storage](https://i.imgur.com/EjIZTvf.png)
3. Markdown-extensible message bodies.
![Markdown-extensible message bodies](https://i.imgur.com/nrFs4si.png)

4. Session-based mail drafts.
![Session-based mail drafts](https://i.imgur.com/Jkwg1iR.png)
5. Sent mail outbox.
![Sent mail outbox](https://i.imgur.com/wdJsKkw.png)
6. Mobile-responsiveness.
![Mobile responsiveness](https://i.imgur.com/gZzrFIR.png)
7. Additional mail functionalities (quick reply, download raw content, save draft, delete draft)
![Download and reply](https://i.imgur.com/NiuBI0n.png)
![Delete and Edit](https://i.imgur.com/gvHxgl1.png)
8. Live mail confirmation tracking with a notifications panel
![Live confirmation tracking](https://i.imgur.com/wrDy8wz.png)
9. Improved error handling via toast notifications
![Error handling via toast](https://i.imgur.com/bJ9Pvgf.png) 
10. Direct add email receiver via URL (a.k.a quick-links to send individuals mail), with `/inbox/to=address` format. 
![Direct add links](https://i.imgur.com/aWjvNXc.gif)
11. Experimental: Contacts
![Contacts](https://i.imgur.com/t1kAUKZ.png)
12. and much more... 

## Community Feedback
To gauge as much community feedback as possible, I released beta versions of Weve to the Discord community early-on. In this way, I was able to collect valuable feedback from users, hands-on, and implement it directly towards application improvements. Some of the feedback I iterated upon included:

 1. Virtualizing inbox list to improve performance for users with >100 mails in their inbox (kudos @tiamat).
 2. Cached transactions post-first-load to reduce network requests and improve performance (kudos @SystemWizard).
 3. Added an outbox (aka sent page) to show outgoing mail transactions (kudos @tiamat, @woombash).
 4. Added error handling for insufficient balances (kudos @dwrx).
 5. Updated text copy of keyfile upload to make more user-friendly (kudos @woombash).
 6. and more... (you can see full changelogs in the weavemail-client channel in Discord)

## Significant design decisions
1. The first significant design decision that I analyzed was prompting the user to confirm the transaction fee (validation) when composing a mail. In earlier beta versions of Weve, the user would be prompted to confirm the fee that they were paying for sending a transaction. Upon analysis, though, I found that at any given point of time, the cost of sending even a large markdown mail would be minimal if any (in the 1/1000s of a cent, at least at current permaweb usage benchmarks). Thus, to reduce friction and make the experience as seamless as possible for an average Web 2.0 user, I've removed the fee validation.
2. The second significant design decision that I analyzed was the use of `sessionStorage` vs `localStorage`. In my opinion, a large majority of individuals working on this bounty will have likely opted to use `localStorage`. After conducting some research, and asking various individuals their preference through Discord, I found that `localStorage` is a very insecure means of saving secure keyfile data. Since it is exposed to every single website, and lasts for the complete browsing session, any malicious website can easily retrieve your keyfile from storage. As such, saving data like the keyfile and mail drafts in `localStorage` could prove to be harmful for user security. As such, I opted to use `sessionStorage` instead which is limited to a browser-tab and domain scope, significantly increasing the security of the users data. Although it adds some minimal friction (the user has to re-upload their keyfile should they close the tab), it is well worth it for the added security.
3. I debated adding an account page to weve, but ended up choosing against it. The only information I would be able to show on an account page would be an individuals address and their wallet balance, which I felt were not necessary and would retract from the core-focus of the mail client.
4. Experimental feature: Contacts. This is an experimental feature I choose to include, which lets users save frequent addresses as contacts (that they can easily send mail to in the future). It uses a repository account (a.k.a, when you create a contact, it sends a transaction to the repository from your account). This is currently experimental since it requires significantly more testing before I am happy with its functionality. For the time being, though, it is fully operational (albeit without encrypting the contact data with your public_key, so be careful if you're linking names to addresses—it will be public to the complete blockchain should they choose to parse it).
