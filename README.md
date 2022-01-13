# Anyberry

**E-commerce** website for buying fresh &amp; tasty berries 🍓. Healthy organic food for any one!

> Real app with real features!

## Running

Start redis:

```bash
docker compose up -d redis
```

Start the celery worker for processing tasks:

```sh
celery --app=anyberry worker --loglevel=INFO
```

Run Django server:

```sh
./manage.py runserver
```

**QIWI callbacks**:

For working with QIWI API and process payment callbacks:

QIWI requirements:

- HTTPs (:443) server signed certificate by authority:

Start ngrok tunnel from `https://xxx.ngrok.io:443` to the local server `http://localhost:8000`:

```sh
ngrok http 8000
```

Change QIWI callback URL to the radom ngrok URL `https://xxx.ngrok.io`. Sadly it is required every time ngrok is being restarted.

`https://xxx.ngrok.io/api/v1/qiwi/callback/`

## Description

### What I want this project to be like?

- It should be a website where you can buy any kind of berries.
- You should also be able to search for specific berries.
- The website should look OK and have basic styling, some animation and interactivity. And mobile responsive.
- Website should provide description, price and additional information about specific berry.
- It should be able to add liked berries to the cart.
- User can purchase berries in the cart if logined, or register a new account.
- Website should provide real ability to buy berries, money should transfer.

### List of features

Possible project features:

- Nice name, logo and content
- Rendering, photo preview
- Berry kinds, sorts, categories
- CRUD operations
- Account/Auth
  - OAuth, Google
  - SberID, Yandex (ru)
- Shopping cart
- Payments
  - credit/debit card
  - PayPal/Yandex Money
- Delivery (location)
- Localization/internationalization
- Paid services
  - mail, SMS (ru)
  - hosting (ru)
  - domain (ru)
- Production deployment
  - HTTPs
- Oriented on Russian market (ru)
- Analytics, advertisement
- Social media sharing/commenting
  - Disqus
- Updates, newsletter, RSS
- Docker/Nginx/Gunicorn
- Redis (cache store + NoSQL database)

### Roadmap

- [x] enhance model + interface/markup
- [x] auth/email/social + SPA
- [x] shopping cart
- [x] orders
- [x] payments
- [ ] favorite list functionality
- [ ] favorite list design
- [ ] calculate price of berries in the order
- [ ] secure password design
- [ ] auth interface
- [ ] docker/production

#### Shopping cart

Users can add berries to the shopping cart and then buy them all at once. Every user has only
one shopping cart which contains berries from the list of available berries on the home page.
Users can list berries in the cart, add, remove or clear the whole cart from berries. Shopping
cart is only available for authenticated and verified users. If the berry was deleted or run out
the user should notice that is the cart.

- GET `/cart/` should list cart berries for session user.
- POST `/cart/<berry_id>/` should add berry to the cart.
- DELETE `/cart/` should clear all cart berries.
- DELETE `/cart/<berry_id>/` should destroy berry in the cart.

Authenticated users should be presented with the cart icon on the header. In which all cart-added
berries will be rendered. The users can add any berry to the cart by clicking the button. Users also
can remove berries from the cart or clear the whole cart. Users should see whether the berry is added
to the cart or not (via berries API).

- add berry button on the berry page
- remove berry button on the berry page
- shopping cart page
- clear shopping cart on the cart page

### Payments

The goal of payments is to **get money from the customer**. To make payments work I will integrate QIWI P2P API into own backend API. QIWI P2P is a person-to-person API:

It will be used to:

- invoice bills when users submits an order, the order state when requested will be `pending`

- check bill status or receive a web hook when bill is paid, serialize order status in response

- reject bill if order is rejected

Because payment API will be integrated into existing backend, our backend will be depended upon the database state of another system and some action will required to query this state to determine response to initial request.

My API will utilize (be powered by) the already built financial infrastructure through "duplicate" API calls when
my API is called.

**Relation between orders and bills**:

The relation is 1 to 1:

- one order can have only 1 bill
- bill can belong only to 1 order

So the information about the bill can be integrated into order response or be in a separate sub-endpoint.

### Payment event

When the bill is paid the request is sent to the webhook for processing this event.
The server will:

1. Push a background task to the queue (with paid bill id)

2. Send an email to the order user with the payment receipt and information about delivery

3. delivery should be started

### Information about the order for client:

- berries that are ordered

- total price of all berries (same as pay amount)

- user how ordered (request.user)

- where to pay for order

- how much to pay

- in which currency to pay

- when was the order bill created to pay

- when will the bill be expired

- the order status (depends on bill status)

**Checklist:**

- [x] Create bill when order is created

- [x] Order bill proxy API (API facade) (for QIWI API)

- [x] Cache bill information view (prevent expensive API requests, serialization, ...)

- [x] Reject bill on order reject

- [x] Endpoint to get information about bill reject task

- [x] Payment webhook processing

**Caching benchmark**:

Caching for 1 minute (60 seconds)

| Get bill (cold run) | Get bill (without cache) | Get bill (cached) | Get order (no cache) |
| ------------------- | ------------------------ | ----------------- | -------------------- |
| up to 1626 ms       | 200-400 ms               | 10-15 ms          | 8-10 ms              |

**Tasks API endpoint:**

To delay the reject bill API call the order API will return a task id of task associated with rejecting the bill.
To get the result and status of task from the _Redis result backend_ via Celery task API will be available.

### Payments provider information

It will take:

- 0% fee via QIWI wallet or cart via QIWI

- 2% fee via cart (other)

- 2% withdraw fee + 50 rubles (cash from QIWI cart or transfer to the cart)

You can get money via form, username, link, widget or API calls (create form).

Bill can be paid via:

- debit cart

- Google Pay / Apple Pay

- QIWI wallet

- Express payment system

#### Orders

When users press "Order" on the shopping cart page they creating a new order
from all berries in the cart.

- POST `/cart/` will make an order
- GET `/orders/` will return user's orders

## Favorite berries

The user can add/remove berries from the favorite list or wish list. Later he can came back and move
all or individual berries from the with to the cart for further buying and paying the bill.

## Berry delivery

When the order is placed and paid it should be in delivery status meaning going to the client.

## Order cheque

In order to store information about sent order cheques to users to prevent duplicate sending if
QIWI duplicate the payment webhook it will be stored in the Redis/cache for 1 day.

- persistent (after Redis reboot)
- expires after 1 day (43,200 seconds)

### Project goals

- make usable e-commerce website
- learn how to make a little bit "real" website
- learn how to integrate with other web services
- learn how to go from idea to the final result
- learn how to design, manage, work on project
- and a lot of other software development / business skills

### Project uniqueness and difference

What differ this project from all other? What makes it special?

- it will be the most closest to the **real** (basically money-related)
- it will be production ready and further **running in production**
- it will a have a **technology stack** closest to production running
