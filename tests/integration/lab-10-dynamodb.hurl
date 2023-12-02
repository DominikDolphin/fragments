# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user3@email.com:password3
# Body of the request goes in ```...``` when it's a string
{ "service": "DynamoDB" }

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
fragment1_url: header "Content-Location"
fragment1_id: jsonpath "$.fragment.id"

# GET fragment info
GET {{fragment1_url}}/info
[BasicAuth]
user3@email.com:password3

HTTP/1.1 200
Content-Type: application/json; charset=utf-8

# POST Markdown Fragment
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
[BasicAuth]
user3@email.com:password3
# Body of the request goes in ```...``` when it's a string
`DynamoDB is **great**.`

HTTP/1.1 201
[Captures]
fragment2_url: header "Content-Location"
fragment2_id: jsonpath "$.fragment.id"

# GET fragment info
GET {{fragment2_url}}/info
[BasicAuth]
user3@email.com:password3

HTTP/1.1 200
Content-Type: application/json; charset=utf-8

GET http://localhost:8080/v1/fragments
[BasicAuth]
user3@email.com:password3

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

DELETE {{fragment1_url}}
[BasicAuth]
user3@email.com:password3
HTTP/1.1 200

GET {{fragment1_url}}
[BasicAuth]
user3@email.com:password3
HTTP/1.1 404

GET http://localhost:8080/v1/fragments
[BasicAuth]
user3@email.com:password3

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}
