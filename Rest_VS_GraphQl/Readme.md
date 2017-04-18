#### REST
1. An architectural concept for network-based software

2. no official set of tools, no specification, not only use HTTP

3. is designed to decouple an API from the client

4. the focus is on making APIs last for decades, 
   instead of optimizing for performance

5. uniform interface of the protocals it exists in

6. Another main focus for REST is **hypermedia controls** (**[HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)** -- Hypermedia as the engine of application state)

7. A REST client need no prior knowledge about how to interact with any particular application or server beyond a generic understanding of hypermedia

-- By contrast, in some SOA(service-oriented architectures), clients and servers interact through a fixed interface shared through documentation or an interface description language(IDL)

- For example: here is a GET request to fetch an Account resource, requesting details in an XML representation:
```
	GET /accounts/12345 HTTP/1.1
    Host: bank.example.com
    Accept: application/json
    ...
```
- Here is the response
```
	HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: ...
    {
    	account: {
    		account_number: 12345,
    		balance: '100',
    		deposit: 'https://bank.example.com/accounts/12345/deposit',
    		withdraw: 'https://bank.example.com/accounts/12345/withdraw',
    		transfer: 'https://bank.example.com/accounts/12345/transfer',
    		close: 'https://bank.example.com/accounts/12345/close"'
    	}
    }
```
- Some time later the account information is retrieved again, but account is overdrawn
```
	HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: ...
    {
    	account: {
    		account_number: 12345,
    		balance: '-25',
    		deposit: 'https://bank.example.com/accounts/12345/deposit'
    	}
    }
```
- In its current state, the other links are not available. This is the term Engine of Application State
- The HATEOAS constraint is an essential part of the **"uniform interface"** feature of REST



#### GraphQL
1. a query language, specification, collection of tools

2. designed to operate over **a single endpoint via HTTP optimizing for performance**