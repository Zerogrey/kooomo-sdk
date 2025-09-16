# Kooomo SDK

A JavaScript client for interacting with the Kooomo e-commerce platform API.

## Table of Contents

- [Installation](#installation)
- [Initialization](#initialization)
- [API Reference](#api-reference)
    - [Session Management](#session-management)
    - [Cart Operations](#cart-operations)
    - [Product Information](#product-information)
    - [Checkout](#checkout)
- [Examples](#examples)
- [Error Handling](#error-handling)

## Installation

Include the SDK in your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/zerogrey/kooomo-sdk@0.1.2/kooomo-sdk.js"></script>
```

## Initialization

Initialize the SDK with your API key and the base URL:

```javascript
const sdk = new KooomoSDK({
    apiKey: 'YOUR-API-KEY-HERE',
    baseUrl: 'https://your-store-domain-here.com'
});
```

## API Reference

### Session Management

#### Create Session

Initialize a new session with Kooomo:

```javascript
const sessionResponse = await sdk.createSession({
    country: 'GB' // optional: ISO country code
});
```

The session token is automatically stored in sessionStorage.

#### Get Session Token

Retrieve the current session token:

```javascript
const token = sdk.getSessionToken();
```

### Cart Operations

#### Add to Cart

Add one or more products to the cart:

```javascript
const cartResponse = await sdk.addToCart({
    sessionToken: 'optional-session-token', // Optional: will use stored token if not provided
    products: [
        {
            product_code: 'DEMO1',
            sku_code: '0',
            quantity: 1
        }
    ]
});
```

#### Get Cart

Retrieve the current cart contents:

```javascript
const cart = await sdk.getCart({
    sessionToken: 'optional-session-token', // Optional: will use stored token if not provided
    language: 'EN', // Optional: language iso code
    country: 'GB', // Optional: country code
    productDetails: true // Optional: include product details, default is true
});
```

### Product Information

#### Get Product Details

Retrieve details about a specific product:

```javascript
const productDetails = await sdk.getProductDetails('DEMO1', {
    sku_id: 'optional-sku-id',
    sku_code: 'optional-sku-code',
    sku_barcode: 'optional-barcode',
    store_code: 'optional-store-code',
    country: 'GB', // Optional: country code
    language: 'EN' // Optional: language code
});
```

#### Search Products

Search for products with various filters:

```javascript
const searchResults = await sdk.searchProducts({
    q: 'search-term', // Optional: search query
    category_id: '123', // Optional: category ID
    country: 'GB', // Optional: country code
    language: 'EN', // Optional: language code
    page: 1, // Optional: page number
    limit: 20 // Optional: results per page
    // Other filter parameters as needed
});
```

#### Get Product Availability

Check product availability:

```javascript
const availability = await sdk.getProductAvailability('DEMO1', {
    country: 'GB', // Optional: country code
    store_code: 'optional-store-code',
    sku_id: 'optional-sku-id',
    sku_code: 'optional-sku-code'
});
```

#### Get Product Price

Retrieve pricing information:

```javascript
const price = await sdk.getProductPrice('DEMO1', {
    sku_id: 'optional-sku-id',
    sku_code: 'optional-sku-code',
    country: 'GB' // Optional: country code
});
```

### Checkout

#### Get Checkout URL

Generate a URL for checkout:

```javascript
const checkoutUrl = sdk.getCheckoutUrl('optional-session-token');
```

#### Redirect to Checkout

Redirect the browser to the checkout page:

```javascript
sdk.redirectToCheckout('optional-session-token');
```

### User

#### Login

Authenticate a user:

```javascript
sdk.login('username', 'password');
```

#### Register

Register a user:

```javascript
sdk.registerUser({
  "email": 'some-new-user@email.com',
  "password": 'some_password',
  "first_name": "Enrique",
  "last_name": "Suarez",
  "shipping_address": {
    "address_1": "Building, apt 1",
    "address_2": "Sample Street",
    "address_3": "Avenue Av.",
    "country": "IE",
    "state": "D",
    "city": "Dublin",
    "telephone": "0831234567",
    "post_code": "D1"
  },
  "country": "IE",
  "gender": "M",
  "profession": "Software Developer",
  "privacy_profiling": false,
  "privacy_marketing": false,
  "privacy_fidelity": false,
  "date_of_birth": "2020-01-01",
  "barcode": "",
  "origin": "",
  "custom_fields": {
    "customFieldName": "6"
  }
});
```

#### Recover Password

Recover a password:

```javascript
const recoverCodes = sdk.recoverPassword('some-new-user@email.com');
```

#### Reset Password

Reset a password:

```javascript
sdk.resetPassword('some-new-user@email.com', 'recovery-code', 'new_password');
```

## Examples

A complete working example is provided in the `example.html` file. This example demonstrates:

- Creating a session
- Adding items to cart
- Retrieving cart contents
- Getting checkout URLs
- Displaying product information
- Checking product availability and pricing
- Login a user
- Registering a user
- Recovering and resetting a password

## Error Handling

All async methods will throw errors if the API returns a non-200 response. Always use try/catch blocks to handle potential errors:

```javascript
try {
    const cartData = await sdk.getCart();
    // Handle successful response
} catch (error) {
    console.error('Error retrieving cart:', error.message);
    // Handle error appropriately
}
```
