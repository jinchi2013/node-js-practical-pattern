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
		account_number: 12345,
		balance: '100',
		deposit: 'https://bank.example.com/accounts/12345/deposit',
		withdraw: 'https://bank.example.com/accounts/12345/withdraw',
		transfer: 'https://bank.example.com/accounts/12345/transfer',
		close: 'https://bank.example.com/accounts/12345/close'
    }
```
- Some time later the account information is retrieved again, but account is overdrawn
```
	HTTP/1.1 200 OK
    Content-Type: application/json
    Content-Length: ...
    {
		account_number: 12345,
		balance: '-25',
		deposit: 'https://bank.example.com/accounts/12345/deposit'
    }
```
- In its current state, the other links are not available. This is the term Engine of Application State
- The HATEOAS constraint is an essential part of the **"uniform interface"** feature of REST

8. One of the most common tasks REST APIs provide is **CRUD** via JSON, but it can do plenty more than that such as file upload
- HTTP body
```
POST /avatars HTTP/1.1
Host: localhost:3000
Content-Type: image/jpeg
Content-Length: 284

raw image content
```
- Leveraging a cool part of HTTP (and therefore REST), API developers can support application/json requests on the same endpoint to handle the upload slightly differently, and offer URL-based uploads too:
```
POST /avatars HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "image_url" : "https://example.org/pic.png"
}
```
- This is the approach you are forced to take with GraphQL, because you can only speak to GraphQL in terms of fields:
```
POST /graphql HTTP/1.1
Host: localhost:3000
Content-Type: application/graphql

mutation addAvatar {
  addAvatarFromUrl(image_url: "https://example.org/pic.png") {
    id,
    image_url
  }
}
```
- Some will argue that this is more "clean", and it is, it's very clean, but being forced to create another service is overkill for smaller images, especially early on. 

9. REST over HTTP uses a whole pile of HTTP conventions that make existing HTTP clients, HTTP cache proxies, etc., all work easily to benefit both Api clients and Api servers, but with GraphQL...**tough**.



#### GraphQL
1. a query language, specification, collection of tools

2. designed to operate over **a single endpoint via HTTP optimizing for performance**
- use with [node.js(offical docs)](http://graphql.org/graphql-js/)

3. GraphQL makes it easy to track specific field usage to a client

4. GraphQL is always the smallest possible request, whilst REST generally defaults to the fullest. It's common practice to offer options like ?fields=foo,bar or partials.[Google recommendation for partial resource](https://developers.google.com/google-apps/tasks/performance#partial)

5. GraphQL is a query language that allows the client to describe the data it needs and its shape by providing a common interface for client and server. An interface, between the client and the server, also makes retrieving data and manipulations more efficient because it encourages using **only the data needed, rather than retrieving a fixed set of data.**
