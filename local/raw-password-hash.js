const crypto = require('crypto');
const scrypt = require('scrypt-js');

function hash(string) {
	return new Promise(resolve => {
		string = Buffer.from(string.normalize('NFKC'), 'utf8');
		crypto.randomBytes(32, async (error, salt) => {
			if(error) {
				throw error;
			}

			const N = 1024;
			const r = 8;
			const p = 1;
			const dkLen = 32;

			const hash = await scrypt.scrypt(string, salt, N, r, p, dkLen);

			resolve(`${salt.toString('hex')}::${Buffer.from(hash).toString('hex')}`);
		});
	});
}

const run = async (pwd) => {
	console.log(await hash(pwd))
}

run(process.argv.slice(2)[0].trim())