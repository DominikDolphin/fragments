# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/csvs
# Include HTTP Basic Auth credentials
[BasicAuth]
user123@email.com:password123
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

HTTP/1.1 401
# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" isString
jsonpath "$.error.message" == "Unauthorized"
