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
        let mailParse = JSON.parse(arweave.utils.bufferToString(await decrypt_mail(arweave.utils.b64UrlToBuffer(tx.data), key)));
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
