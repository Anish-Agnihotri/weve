// TODO: Add documentation
import Arweave from 'arweave/web';
const arweave = Arweave.init();

export const decrypt_mail = async (enc_data, key) => {
    var enc_key = new Uint8Array(enc_data.slice(0, 512))
    var enc_mail = new Uint8Array(enc_data.slice(512))

    var symmetric_key = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, enc_key)

    return arweave.crypto.decrypt(enc_mail, symmetric_key)
};

export const wallet_to_key = async wallet => {
    var w = Object.create(wallet)
    w.alg = 'RSA-OAEP-256'
    w.ext = true

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

	return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt'])
};

export const get_mail_from_tx = async tx => {
    let mail_item;

    await arweave.transactions.get(tx).then(async tx => {
        let key = await wallet_to_key(JSON.parse(sessionStorage.getItem('keyfile')));
        let mailParse;

        if (tx.format === 1) {
            mailParse = JSON.parse(arweave.utils.bufferToString(await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key)));
        } else if (tx.format === 2) {
            await arweave.transactions.getData(tx.id).then(async data => {
                mailParse = JSON.parse(arweave.utils.bufferToString(await decrypt_mail(arweave.utils.b64UrlToBuffer(data), key)));
            })
        }

        let timestamp = tx.get('tags')[2].get('value', { decode: true, string: true });
        let from = await arweave.wallets.ownerToAddress(tx.owner);

        mail_item = {
            "timestamp": timestamp,
            "id": tx.id,
            "from": from,
            "fee": tx.reward / 1000000000000,
            "amount": tx.quantity / 1000000000000,
            "subject": mailParse.subject,
            "body": mailParse.body,
        };
    });

    return mail_item;
}

export const encrypt_mail = async (content, subject, pub_key) => {
    var content_encoder = new TextEncoder()
    var newFormat = JSON.stringify({ 'subject': subject, 'body': content })
    var mail_buf = content_encoder.encode(newFormat)
    var key_buf = await generate_random_bytes(256)

    // Encrypt data segments
    var encrypted_mail =
		await arweave.crypto.encrypt(mail_buf, key_buf)
    var encrypted_key =
		await window.crypto.subtle.encrypt({name: 'RSA-OAEP'}, pub_key, key_buf)

    // Concatenate and return them
    return arweave.utils.concatBuffers([encrypted_key, encrypted_mail])
}

export const get_public_key = async address => {
    var txid = await arweave.wallets.getLastTransactionID(address)

    if (txid === '') {
        return undefined
    }

    var tx = await arweave.transactions.get(txid)

    if (tx === undefined) {
        return undefined
    }

    var keyData = {
        kty: 'RSA',
        e: 'AQAB',
        n: tx.owner,
        alg: 'RSA-OAEP-256',
        ext: true
    }

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

    return await crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt'])
}

const generate_random_bytes = length => {
    var array = new Uint8Array(length)
    window.crypto.getRandomValues(array)

    return array
}
