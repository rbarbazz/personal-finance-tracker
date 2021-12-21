# Personal Finance Tracker

A web app to help track your incomes and expenses.

Requires a Sendgrid API key.

## Environment Variables

Production:

```bash
DATABASE_URL
JWT_ACCESS_SECRET
JWT_VERIF_SECRET
SG_API_KEY
```

Development:

```bash
PG_CONNECTION_STRING_DEV
SG_API_KEY
```

## Deploy to Heroku

```shell
heroku container:push web -a my-app
heroku container:release web -a my-app
```
