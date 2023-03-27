import Arweave from "arweave";
import { arweave } from "./globals";


export const decrypt_mail = async (enc_data, key) => {

    var enc_key = new Uint8Array(enc_data.slice(0, 512))
    var enc_mail = new Uint8Array(enc_data.slice(512))

    var symmetric_key = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, enc_key)

    return Arweave.crypto.decrypt(enc_mail, symmetric_key)
};

export const wallet_to_key = async wallet => {
    var w = Object.create(wallet)
    w.alg = 'RSA-OAEP-256'
    w.ext = true

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

	return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt'])
};

export const get_mail_from_tx = async node => {
    let mail_item;
    let key = await wallet_to_key(JSON.parse(sessionStorage.getItem('keyfile')));
    let mailParse;

    let data = [];
    let result = await arweave.api.get(`/${node.id}`, { responseType: "arraybuffer" });
    if (result.status >= 200 && result.status < 300) {
        console.log(result);
        data = result.data;
        try { 
            console.log(data);
            let decrypted = await decrypt_mail( data, key);
            mailParse = JSON.parse(Arweave.utils.bufferToString(decrypted));
            console.log("MailParse", mailParse);

            let unixTime = Math.floor(new Date().valueOf() / 1000.0);
            let appName = "";

            node.tags.forEach((tag) => {
                const name = tag.name;
                const value = tag.value;
                if (name === 'Unix-Time') { unixTime = parseInt(value, 10); }
                if (name === 'App-Name') { appName = value; }
            });
            
            let from = node.owner.address;

            console.log(node);

            mail_item = {
                "timestamp": unixTime,
                "id": node.id,
                "from": from,
                "fee": parseInt(node.fee.winston) / 1000000000000,
                "amount": parseInt(node.quantity.winston) / 1000000000000,
                "subject": mailParse.subject,
                "body": mailParse.body,
            };
        } catch(e) {
            console.log(e.message);
        }
    }
    
    return mail_item;
}

export const get_sent_mail_from_tx = async tx => {
    let sent_mail_item;

    await arweave.transactions.get(tx).then(async tx => {
        let timestamp = tx.get('tags')[2].get('value', { decode: true, string: true });

        sent_mail_item = {
            "timestamp": timestamp,
            "id": tx.id,
            "to": tx.target,
        }
    });

    return sent_mail_item;
}

export const get_tx_status = async tx => {
    let isPending = true;

    await arweave.transactions.getStatus(tx).then(async status => {
        if (status.confirmed !== null && status.confirmed.number_of_confirmations > 0) {
            isPending = false;
        }
    });

    return isPending;
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

export const identity = async address => {
	let name_query = {
		op: 'and',
		expr1:{
					op: 'equals',
					expr1: 'App-Name',
					expr2: 'arweave-id'
			},
		expr2:{
			op: 'and',
			expr1:{
				op: 'equals',
				expr1: 'from',
				expr2: address
			}, expr2:{
				op: 'equals',
				expr1: 'Type',
				expr2: 'name'
			}
		}
	}

	const txs = await arweave.api.post(`arql`, name_query);

	if(txs.data.length === 0) {
		return address;
	}

	const tx = await arweave.api.get((txs.data)[0]);
	return tx.data;
};
