import bs58 from "bs58";
import nacl from "tweetnacl";

type SignMessage = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
  uri: string;
  version: string;
  chainId: string;
  issuedAt: string;
  requestId: string;
};

export class SigninMessage {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
  uri: string;
  version: string;
  chainId: string;
  issuedAt: string;
  requestId: string;

  constructor({
    domain,
    publicKey,
    nonce,
    statement,
    uri,
    version,
    chainId,
    issuedAt,
    requestId,
  }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
    this.uri = uri;
    this.version = version;
    this.chainId = chainId;
    this.issuedAt = issuedAt;
    this.requestId = requestId;
  }

  prepare() {
    return `
${this.domain} wants you to sign in with your Solana account:
${this.publicKey}

${this.statement}

URI: ${this.uri}
Version: ${this.version}
Chain ID: ${this.chainId}
Nonce: ${this.nonce}
Issued At: ${this.issuedAt}
Request ID: ${this.requestId}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}
