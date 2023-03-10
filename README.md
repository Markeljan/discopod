# DiscoPod - Good Hacks 2023 - DiscoPod

This is the official Good Hacks submission for the DiscoPod project.

## About
Funding Discourse Podcasts for Public Good.
Listen to discourse, contribute to the cause. 
Mint a pod, become a host, choose a topic, fund a cause.
Build a personal brand through engaging community discourse.

## Project Description
This project was hacked together over a 3 day weekend from February 9-12. Built on Next.js and Foundry we used Solidity to build the smart contract, and Typescript to create the website.


Diagram: https://excalidraw.com/#room=5e0054fc35def7c5c4e9,BRXN4Y9CyLUH7DcANSb_Ng


## Getting Started

### Client

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Contract

```bash
forge build && forge test

# set PRIVATE_KEY environment variable in .env.local
source .env.local
bash script/deploy.sh
```