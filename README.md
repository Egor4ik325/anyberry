# Anyberry

E-commerce website for buying fresh &amp; tasty berries 🍓. Healthy organic food for any one!

> Real app with real features!

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
- Analytics, advertisment
- Social media sharing/commenting
  - Disqus
- Updates, newsletter, RSS
- Docker/Nginx/Gunicorn

### Roadmap

- [x] enhance model + interface/markup
- [ ] auth/email/social + SPA
- [x] shopping cart
- [x] orders
- [ ] **payments**
- [ ] localization
- [ ] docker/production
- [ ] enhance model + interface/markup
- [ ] social media/comments

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

**Information about the order for client**:

- berries that are ordered

- total price of all berries (same as pay amount)

- user how ordered (request.user)

- where to pay for order

- how much to pay

- in which currency to pay

- when was the order bill created to pay

- when will the bill be expired

- the order status (depends on bill status)

Checklist:

- [x] Create bill when order is created

- [x] Order bill API (own)

### Payment info

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

### Project goals

- learn how to make a little bit "real" website
- learn how to integrade with other web services
- learn how to go from idea to the final result
- learn how to design, manage, work on project
- and a lot of other software development / business skills

### Project uniqueness and difference

What differ this project from all other? What makes it special?

- it will be the most closest to the **real** (basically money-related)
- it will be production ready and further **running in production**
- it will a have a **technology stack** closest to production running
