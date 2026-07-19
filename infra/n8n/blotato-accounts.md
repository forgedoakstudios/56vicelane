# Blotato connected accounts

Verified working via `GET https://backend.blotato.com/v2/users/me/accounts`
using the `Blotato` Header Auth credential in n8n (header: `blotato-api-key`).

| Platform  | accountId | Handle              |
|-----------|-----------|---------------------|
| YouTube   | 40397     | Christopher (56vicelane) |
| Instagram | 59705     | @56vicelane          |
| TikTok    | 47040     | @56vicelane          |
| X/Twitter | 20503     | @56ViceLane          |

Used as `post.accountId` when calling `POST /v2/posts`, e.g.:

```json
{
  "post": {
    "accountId": "20503",
    "content": {
      "text": "...",
      "mediaUrls": ["https://56vicelane.com/images/gta6-hero.png"],
      "platform": "twitter"
    },
    "target": { "targetType": "twitter" }
  }
}
```
