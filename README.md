<div align="center">
<h1>Grove Portal UI</h1>
<img src="https://storage.googleapis.com/grove-brand-assets/Presskit/Logo%20Joined-2.png" alt="Grove logo" width="500"/>
</div>
<br/>

# Table of Contents <!-- omit in toc -->

- [Run with **Remix**](#run-with-remix)
- [Deployment](#deployment)
- [Development](#development)
  - [Env](#env)
  - [Node Version](#node-version)
  - [Frontend](#frontend)
  - [Stripe Webhook Forwarding](#stripe-webhook-forwarding)
  - [Environment Variables](#environment-variables)
  - [Backend](#backend)

## Run with **Remix**

- [Remix Docs](https://remix.run/docs)

## Deployment

1. **Test Locally**

   - Test your changes locally before creating a PR.

2. **PR / STAGE**

   - Create a PR into the "staging" branch. Continuous Deployment (CD) will automatically deploy to [https://staging.portal.grove.city](https://staging.portal.grove.city).

3. **PROD**

   - Create a PR from "staging" into "main". CD will automatically deploy to [https://portal.grove.city/](https://portal.grove.city).

4. **Test in Main**
   - Test your changes in the main environment to ensure everything is working as expected.

## Development

### Env

Make sure to get the `.env` from [1password](https://start.1password.com/open/i?a=4PU7ZENUCRCRTNSQWQ7PWCV2RM&v=kudw25ob4zcynmzmv2gv4qpkuq&i=usnpm5yls4p4vvtz5srqzuokz4&h=buildwithgrove.1password.com).

### Node Version

---

**Ensure you're using Node v18 (not 22).**

### Frontend

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
pnpm install
```

```sh
pnpm build
```

Afterwards, start the Remix development server like so:

```sh
pnpm dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

If you're used to using the `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) instead, you can also use that, but it's not needed.

### Stripe Webhook Forwarding

If you wish to test the Stripe webhook flow, you must use the Stripe CLI to forward the webhook to your local environment.

[Full instructions can be found on the Stripe documentation page.](https://docs.stripe.com/stripe-cli/overview#forward-events-to-your-local-webhook-endpoint)

You must initialize the Stripe CLI with your Stripe account:

```sh
stripe login
```

Then run the following to start forwarding webhooks:

```sh
stripe --api-key {STRIPE_API_KEY} listen --forward-to http://localhost:3000/api/stripe/webhook
```

It is generally recommended to use the test mode Stripe API key for forwarding webhooks, as this will not create any real subscriptions or charge any real money.

You will be given a webhook signing secret, set it in your `.env` file as `STRIPE_WEBHOOK_SECRET`.

[The webhook handling code in this repo can be found here.](app/routes/api.stripe.webhook/route.tsx).

### Environment Variables

[You can find the environment variables - including for Stripe- here.](https://start.1password.com/open/i?a=4PU7ZENUCRCRTNSQWQ7PWCV2RM&v=kudw25ob4zcynmzmv2gv4qpkuq&i=picsbxs4vwfewipk5zg3rdou2u&h=buildwithgrove.1password.com)

### Backend

This currently requires you to also run the current portal backend on localhost:4200 in order to run. I am working with the backend team to whitelist localhost and enable us to hit the backend.staging.portal.pokt.network endpoints.
