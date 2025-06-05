# Universal Snowflake ID

> ⚡️ Lightweight, dependency-free, Snowflake ID generator with base62 encoding for Node.js, Deno, Bun, and browsers.

[![npm version](https://img.shields.io/npm/v/universal-snowflake-id.svg)](https://www.npmjs.com/package/universal-snowflake-id)
[![build](https://github.com/amiry-jd/universal-snowflake-id/actions/workflows/release.yml/badge.svg)](https://github.com/amiry-jd/universal-snowflake-id/actions)
[![license](https://img.shields.io/npm/l/universal-snowflake-id)](LICENSE)

---

## ✨ Features

- ⚡️ **High performance**, 64-bit Snowflake ID generator
- 🌐 **Universal**: Works in **Node.js**, **Bun**, **Deno**, and modern **browsers**
- 🔢 **Base62 encoding** for shorter, URL-friendly IDs
- 📦 Supports **CJS**, **ESM**, and **UMD** module formats
- 🗓️ Supports custom or predefined **epochs** (Twitter, Discord, or your own)
- 🛠 No external dependencies

---

## 📦 Installation

```bash
# Bun
bun add universal-snowflake-id

# npm
npm install universal-snowflake-id

# yarn
yarn add universal-snowflake-id

# pnpm
pnpm add universal-snowflake-id
```

---

## 🚀 Usage

### Basic

```ts
import { Snowflake } from "universal-snowflake-id";

const snowflake = new Snowflake({
  datacenterId: 1,
  machineId: 1,
});

const id = snowflake.generate(); // bigint
const shortId = snowflake.generateBase62(); // string
```

---

### Use with predefined epochs

```ts
import { Snowflake } from "universal-snowflake-id";

const discordSnowflake = new Snowflake({
  datacenterId: 1,
  machineId: 1,
  epoch: "discord",
});

const twitterSnowflake = new Snowflake({
  datacenterId: 1,
  machineId: 1,
  epoch: "twitter",
});
```

---

### Environment-based default instance

```ts
import snowflake from "universal-snowflake-id";

// Uses env vars: SN_DATACENTERID, SN_MACHINEID, SN_EPOCH
const id = snowflake.generateBase62();
```

> `SN_EPOCH` can be a number, `discord`, or `twitter`.

---

## 🔢 API

### `new Snowflake(options)`

| Option         | Type                               | Description                                 |
| -------------- | ---------------------------------- | ------------------------------------------- |
| `datacenterId` | `number` (0–31)                    | Required – identifies the datacenter        |
| `machineId`    | `number` (0–31)                    | Required – identifies the machine within DC |
| `epoch`        | `number \| "discord" \| "twitter"` | Optional – default is current timestamp     |

### `generate(): bigint`

Returns a new Snowflake ID as a `bigint`.

### `generateBase62(): string`

Returns a new Snowflake ID as a short base62 string.

### `parseBase62(str: string): bigint`

Decodes a base62 string back to its original `bigint`.

---

## 📚 Predefined Epochs

| Name      | Description               | Value           |
| --------- | ------------------------- | --------------- |
| `twitter` | Twitter's Snowflake epoch | `1288834974657` |
| `discord` | Discord's Snowflake epoch | `1420070400000` |

---

## 🧪 Testing

```bash
bun test
```

You can also use Node or Vitest if preferred.

---

## 📦 Build

```bash
bun run build
```

Generates `dist/` folder with CJS, ESM, and UMD builds using `microbundle`.

---

## 🚀 Releasing

This project uses [`release-it`](https://github.com/release-it/release-it) with GitHub Actions:

```bash
bunx release-it
```

This:

- Bumps version
- Builds the package
- Publishes to npm
- Creates GitHub tag/release (if configured)

---

## 👷 CI/CD

- Automatically builds and publishes on GitHub tag push
- GitHub Actions config in `.github/workflows/release.yml`

---

## 📁 Output

Built with `microbundle`, output includes:

- `dist/index.cjs.js`
- `dist/index.esm.js`
- `dist/index.umd.js`
- `dist/index.d.ts` (types)

---

## 🪪 License

MIT © [@amiry-jd](https://github.com/amiry-jd)

---

## 💡 Inspiration

Inspired by Twitter/Discord Snowflake implementations and ID generation needs in modern distributed systems.
