(function (global) {

    function KooomoSDK(config) {
        if (!config || !config.apiKey || !config.baseUrl) {
            throw new Error('KooomoSDK: apiKey and baseUrl are required.');
        }

        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
        this.sessionStorageKey = 'kooomo_session_token';
    }

    KooomoSDK.prototype._saveSessionToken = function (token) {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(this.sessionStorageKey, token);
        }
    };

    KooomoSDK.prototype.getSessionToken = function () {
        if (typeof sessionStorage !== 'undefined') {
            return sessionStorage.getItem(this.sessionStorageKey);
        }
        return null;
    };

    KooomoSDK.prototype.createSession = async function ({country}) {
        const url = `${this.baseUrl}/api/v0/storeFront/createSession`;

        const payload = {
            country: country,
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Kooomo-Api-Key': this.apiKey,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to create session: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();
        if (result.response.token) {
            this._saveSessionToken(result.response.token);
        }

        return result;
    };

    KooomoSDK.prototype.addToCart = async function ({sessionToken, products = [], country}) {
        const token = sessionToken || this.getSessionToken();
        if (!token) {
            throw new Error('KooomoSDK addToCart: No sessionToken available.');
        }

        const url = `${this.baseUrl}/api/v0/storeFront/cart`;

        const payload = {
            session_token: token,
            products: products,
            country: country,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Kooomo-Api-Key': this.apiKey,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to add to cart: ${response.status} - ${errorBody}`);
        }

        return await response.json();
    };

    KooomoSDK.prototype.getCart = async function ({
                                                      sessionToken,
                                                      language,
                                                      country,
                                                      productDetails = true,
                                                  } = {}) {
        const token = sessionToken || this.getSessionToken();
        if (!token) {
            throw new Error('KooomoSDK getCart: No sessionToken available.');
        }

        const query = new URLSearchParams({
            language: language ? language : null,
            productDetails: productDetails ? '1' : '0',
            country: country ? country : null,
        });

        const url = `${this.baseUrl}/api/v0/storeFront/cart/${encodeURIComponent(token)}?${query.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Kooomo-Api-Key': this.apiKey,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to get cart: ${response.status} - ${errorBody}`);
        }

        return await response.json();
    };

    KooomoSDK.prototype.getCheckoutUrl = function (sessionToken) {
        const token = sessionToken || this.getSessionToken();
        if (!token) {
            throw new Error('KooomoSDK getCheckoutUrl: No sessionToken available.');
        }

        return `${this.baseUrl}/eshop/cart/action/checkoutByToken/?token=${encodeURIComponent(token)}`;
    };

    KooomoSDK.prototype.getProductDetails = async function (productIdOrCode, {sku_id, sku_code, sku_barcode, store_code, country, language} = {}) {
        if (!productIdOrCode) {
            throw new Error('KooomoSDK getProductDetails: productIdOrCode is required.');
        }

        const query = {
            ...(sku_id && { sku_id }),
            ...(sku_code && { sku_code }),
            ...(sku_barcode && { sku_barcode }),
            ...(store_code && { store_code }),
            ...(country && { country }),
            ...(language && { language }),
        };

        const params = new URLSearchParams(query).toString();
        const url = `${this.baseUrl}/api/v0/storeFront/catalog/product/${encodeURIComponent(productIdOrCode)}${params ? '?' + params : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Kooomo-Api-Key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`getProductDetails failed: ${response.status}`);
        }

        return await response.json();
    };

    KooomoSDK.prototype.searchProducts = async function (query = {}) {
        const params = new URLSearchParams(query).toString();
        const url = `${this.baseUrl}/api/v0/storeFront/catalog/product${params ? '?' + params : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Kooomo-Api-Key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`searchProducts failed: ${response.status}`);
        }

        return await response.json();
    };

    KooomoSDK.prototype.getProductAvailability = async function (productIdOrCode, {country, store_code, sku_id, sku_code}) {
        if (!productIdOrCode) {
            throw new Error('KooomoSDK getProductAvailability: productIdOrCode is required.');
        }

        const query = {
            ...(sku_id && { sku_id }),
            ...(sku_code && { sku_code }),
            ...(store_code && { store_code }),
            ...(country && { country }),
        };

        const params = new URLSearchParams(query).toString();
        const url = `${this.baseUrl}/api/v0/storeFront/catalog/product/${encodeURIComponent(productIdOrCode)}/availability${params ? '?' + params : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Kooomo-Api-Key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`getProductAvailability failed: ${response.status}`);
        }

        return await response.json();
    };

    KooomoSDK.prototype.getProductPrice = async function (productIdOrCode, {sku_id, sku_code, country}) {

        const query = {
            ...(sku_id && { sku_id }),
            ...(sku_code && { sku_code }),
            ...(country && { country }),
        };


        if (!productIdOrCode) {
            throw new Error('KooomoSDK getProductPrice: productIdOrCode is required.');
        }

        const params = new URLSearchParams(query).toString();
        const url = `${this.baseUrl}/api/v0/storeFront/catalog/product/${encodeURIComponent(productIdOrCode)}/price${params ? '?' + params : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Kooomo-Api-Key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`getProductPrice failed: ${response.status}`);
        }

        return await response.json();
    };

    KooomoSDK.prototype.redirectToCheckout = function (sessionToken) {
        window.location.href = this.getCheckoutUrl(sessionToken);
    };

    KooomoSDK.prototype.login = async function(username, password) {
        const url = `${this.baseUrl}/api/v1/user/login`;
        const payload = { username, password};
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Kooomo-Api-Key': this.apiKey,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to login: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();
        const sessionToken = result.session_token;
        if (!sessionToken) {
            throw new Error('Login response did not contain session_token');
        }
        this._saveSessionToken(sessionToken);
    };

    KooomoSDK.prototype.registerUser = async function ({
        username,
        password,
        first_name,
        last_name,
        shipping_address = {
            address_1: '',
            address_2: '',
            address_3: '',
            country: '',
            city: '',
            state: '',
            telephone: '',
            postcode: '',
        },
        country,
        gender,
        profession,
        privacy_profiling,
        privacy_marketing,
        privacy_fildelity,
        date_of_birth,
        barcode,
        origin,
        custom_fields
    }) {
        const url = `${this.baseUrl}/api/v0/user`;
        const payload = {
            username,
            password,
            first_name,
            last_name,
            shipping_address,
            country,
            gender,
            profession,
            privacy_profiling,
            privacy_marketing,
            privacy_fildelity,
            date_of_birth,
            barcode,
            origin,
            custom_fields
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Kooomo-Api-Key': this.apiKey,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to register user: ${response.status} - ${errorBody}`);
        }
    };

    KooomoSDK.prototype.recoverPassword = async function (email) {
        const url = `${this.baseUrl}/api/v0/user/recoverPassword`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Kooomo-Api-Key': this.apiKey,
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to recover password: ${response.status} - ${errorBody}`);
        }
    };

    KooomoSDK.prototype.resetPassword = async function (email, code, newPassword) {
        const url = `${this.baseUrl}/api/v0/user/resetPassword`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Kooomo-Api-Key': this.apiKey,
            },
            body: JSON.stringify({ email, code, new_password: newPassword }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to reset password: ${response.status} - ${errorBody}`);
        }
    }

    // Expose it to the global scope
    global.KooomoSDK = KooomoSDK;
})(window);
