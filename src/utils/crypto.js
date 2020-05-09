import Arweave from 'arweave/web';
const arweave = Arweave.init();

export async function decrypt_mail (enc_data, key) {
    var enc_key = new Uint8Array(enc_data.slice(0, 512))
    var enc_mail = new Uint8Array(enc_data.slice(512))

    var symmetric_key = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, enc_key)

    return arweave.crypto.decrypt(enc_mail, symmetric_key)
}

export const wallet_to_key = async wallet => {
    var w = Object.create(wallet)
    w.alg = 'RSA-OAEP-256'
    w.ext = true

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

	return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt'])
}
