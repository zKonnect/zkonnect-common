import bs58 from "bs58";
import nacl from "tweetnacl";

type JoinMessage = {
  domain: string;
  publicKey: string;
  expTime: string;
  statement: string;
};

export class JoinMeetMessage {
  domain: any;
  publicKey: any;
  expTime: any;
  statement: any;

  constructor({ domain, publicKey, expTime, statement }: JoinMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.expTime = expTime;
    this.statement = statement;
  }

  prepare() {
    return `${this.statement}
 
${this.domain} 
 
Expires on ${this.expTime}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}
