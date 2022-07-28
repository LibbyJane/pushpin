# Libraries used

* https://github.com/TryGhost/node-sqlite3
* https://www.npmjs.com/package/express-fileupload
* https://www.npmjs.com/package/imagemagick
* https://nodemailer.com/
* https://www.npmjs.com/package/twing (HTML template engine - implements TWIG)


## Migrations Module
https://github.com/tj/node-migrate

### Create a migration
node_modules/.bin/migrate create <migration_name>

### Run migrations manually
node_modules/.bin/migrate

### Run migrations down manually
node_modules/.bin/migrate down


# Cron Tasks

## Daily

### Daily Digest Task

The daily digest task sends a digest of new activity to relevant users.
Digests are only sent if the user has at least 1 new note or 1 new reaction.

To run the task:
```angular2html
node cron/daily/sendDailyDigests.js
```