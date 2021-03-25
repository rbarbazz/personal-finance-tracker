# Personal Finance Tracker

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

```bash
heroku container:push web -a rbarbazz-finance
heroku container:release web -a rbarbazz-finance
```
