// Epochs
export const DISCORD_EPOCH = 1420070400000; // Jan 1, 2015
export const TWITTER_EPOCH = 1288834974657; // Nov 4, 2010

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function encodeBase62(n: bigint): string {
  let result = "";
  const base = BigInt(BASE62.length);
  while (n > 0) {
    result = BASE62[Number(n % base)] + result;
    n /= base;
  }
  return result || "0";
}

function decodeBase62(str: string): bigint {
  return [...str].reduce((acc, char) => {
    const value = BigInt(BASE62.indexOf(char));
    return acc * BigInt(BASE62.length) + value;
  }, 0n);
}

export interface SnowflakeOptions {
  epoch?: number | "discord" | "twitter";
  datacenterId?: number;
  machineId?: number;
}

export class Snowflake {
  private epoch: number;
  private datacenterId: number;
  private machineId: number;
  private sequence: number = 0;
  private lastTimestamp: number = -1;

  constructor(opts: SnowflakeOptions = {}) {
    const rawEpoch = opts.epoch ?? Date.now();
    this.epoch =
      typeof rawEpoch === "string"
        ? rawEpoch === "discord"
          ? DISCORD_EPOCH
          : rawEpoch === "twitter"
          ? TWITTER_EPOCH
          : Date.now()
        : rawEpoch;
    this.datacenterId = opts.datacenterId ?? 0;
    this.machineId = opts.machineId ?? 0;
  }

  private currentTimestamp(): number {
    return Date.now();
  }

  private waitNextMillis(last: number): number {
    let now = this.currentTimestamp();
    while (now <= last) now = this.currentTimestamp();
    return now;
  }

  public generate(): bigint {
    let timestamp = this.currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards");
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0xfff; // 12 bits
      if (this.sequence === 0) timestamp = this.waitNextMillis(timestamp);
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const timePart = BigInt(timestamp - this.epoch) << 22n;
    const datacenterPart = BigInt(this.datacenterId & 0x1f) << 17n;
    const machinePart = BigInt(this.machineId & 0x1f) << 12n;
    const sequencePart = BigInt(this.sequence);

    return timePart | datacenterPart | machinePart | sequencePart;
  }

  public generateBase62(): string {
    return encodeBase62(this.generate());
  }

  static parseBase62(encoded: string): bigint {
    return decodeBase62(encoded);
  }
}

const parseEpoch = (value: string | number | undefined): "twitter" | "discord" | number | undefined => {
  if (!!!value) return undefined;
  if (value === "twitter" || value === "discord") return value;
  if (typeof value === "number") return Number(value);
  return undefined;
};

const snowflake = new Snowflake({
  datacenterId: process.env.SN_DATACENTERID ? parseInt(process.env.SN_DATACENTERID) : undefined,
  machineId: process.env.SN_MACHINEID ? parseInt(process.env.SN_MACHINEID) : undefined,
  epoch: parseEpoch(process.env.SN_EPOCH),
});
export default snowflake;
