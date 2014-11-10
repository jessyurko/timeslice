timeslice
=========

a tool for creating digital bulletin boards. specific use-cases might include:
- crowdsourcing event documentation
- showing a realtime feed of events from multiple contributors
- a community-curated event repository

setting up your own instance of timeslice requires an amazon web services (aws) account to save photos that get emailed. you'll need to save your aws access key id and aws secret access key to a config file that your server can access.

you'll also need a [postmark](https://postmarkapp.com/) account, which will act as an intermediary between users and your server. once you set up a new postmark account and a server, postmark will give you an inbound email address for users to send to (e.g. 12345asbd7593261bdgf@inbound.postmarkapp.com). this email address will be very ungainly; you can create a dedicated email account (e.g. timeslice@mylibrary.org) and set it to auto-forward everything it receives to the ungainly postmark address, so that users only have to type in something simple. you can then set up an inbound hook for postmark that directs it to your server. this address will be something like http://YOUR_DOMAIN.org/api/postmark. the "/api/postmark" part is set in server.js and could be modified.

sample workflow
========
1. user takes a picture / finds a picture on their pc/mobile device.
2. user writes an email to timeslice@mylibrary.org with any associated date information (if it's related to an event). users can tag their message using #hashtags.
3. user attaches picture and sends off email.
4. timeslice@mylibrary.org gets automatically forwarded to 12345asbd7593261bdgf@inbound.postmarkapp.com.
5. postmark sends the email data to your timeslice server.
6. the email gets parsed on your server and saved to your database.
7. any pictures sent get saved to your aws s3 account.

querying submissions
======
user submissions can be queried via http://YOUR_DOMAIN.org/api/search?
current parameters include:
before
after
tag

templates
====
templates are in the works, but you can find some starter code for using timeslice with [isotope](http://isotope.metafizzy.co/index.html), [slick](https://kenwheeler.github.io/slick/), [fabricjs](http://fabricjs.com/), and [bootstrap](http://getbootstrap.com/) in public/templates.

timeslice uses node.js, express, and mongodb. it also leans heavily on chrono.js. timeslice originally came out of the library test kitchen, and was funded through a harvard library lab grant.
