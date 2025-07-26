http://localhost:3000/api/v1/api-keys/keys?user_id=f8216739-2dda-410b-ae94-99efc760a3c4
res
{
  "status": "success",
  "data": [
    {
      "id": "021f02a2-3d3a-47fc-832b-29ce787956b8",
      "full_key": "key_cd164ee3.ZLA92kU9NbCP3zi4c6oLEmk5f3KWK_3bF39IdeMyjAI",
      "expires_at": "2025-08-25T05:57:56.154Z"
    },
    {
      "id": "548135f9-4c5e-467d-8b6c-64067602c372",
      "full_key": "key_47b2fcfb.UGomD7u93w_4pv3XQpDljjXN3JBu7Wh2BKj7Hqyl06w",
      "expires_at": "2025-08-25T06:03:38.464Z"
    }
  ]
}

http://localhost:3000/api/v1/api-keys
req
{
  "user_id": "f8216739-2dda-410b-ae94-99efc760a3c4",
  "scopes": ["read", "write"],
  "expires_in_days": 30
}
res
{
  "status": "success",
  "data": {
    "id": "548135f9-4c5e-467d-8b6c-64067602c372",
    "user_id": "f8216739-2dda-410b-ae94-99efc760a3c4",
    "hashed_secret": "$2b$10$hfFUHxfBeETbbR.DsrYdJOWtr6FmKwv9/T.WMAJhdP8ZAwGS7ufl.",
    "full_key": "key_47b2fcfb.UGomD7u93w_4pv3XQpDljjXN3JBu7Wh2BKj7Hqyl06w",
    "expires_at": "2025-08-25T06:03:38.464Z",
    "createdAt": "2025-07-26T06:03:38.467Z",
    "updatedAt": "2025-07-26T06:03:38.467Z"
  }
}