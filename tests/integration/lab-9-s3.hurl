# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user3@email.com:password3
# Body of the request goes in ```...``` when it's a string
`Hello S3!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Content-Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
[Captures]
url: header "Content-Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user3@email.com:password3

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
user3@email.com:password3

# 1. We expect to get back an HTTP 201
HTTP/1.1 200

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user3@email.com:password3

HTTP/1.1 404