# REST API Documentation

Base URL: `/api/v1`

All protected routes require:

```http
Authorization: Bearer <access_token>
```

## Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register user with role |
| POST | `/auth/login` | Public | Issue access token and refresh cookie |
| POST | `/auth/refresh` | Public cookie | Renew access token |
| POST | `/auth/logout` | Public | Clear refresh cookie |
| POST | `/auth/verify-email` | Public | Verify email token |
| POST | `/auth/forgot-password` | Public | Send OTP |
| POST | `/auth/reset-password` | Public | Reset password using OTP |

## Core Resources

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/vendors?q=&category=&city=&page=&limit=` | Public | Search and paginate vendors |
| POST | `/vendors` | Vendor, Admin | Create vendor profile |
| PATCH | `/vendors/:id/approve` | Admin | Approve vendor |
| GET | `/events` | Authenticated | List scoped events |
| POST | `/events` | Customer, Admin | Create event |
| POST | `/budgets` | Customer, Admin | Add budget item |
| POST | `/bookings` | Customer, Admin | Request vendor booking |
| PATCH | `/bookings/:id/status` | Vendor, Admin | Accept/reject/complete booking |
| POST | `/guests` | Customer, Admin | Add guest and QR token |
| PATCH | `/guests/check-in/:token` | Public token | Check in guest |
| POST | `/payments/intent` | Customer, Admin | Create Stripe payment intent |
| POST | `/reviews` | Customer | Add vendor review |
| POST | `/ai/recommendations` | Authenticated | Generate AI planning response |

## Example Event Request

```json
{
  "title": "Amani & Nuwan Wedding",
  "type": "Wedding",
  "date": "2026-08-16T10:00:00.000Z",
  "time": "10:00",
  "venue": {
    "name": "Mount Lavinia Hotel",
    "city": "Colombo"
  },
  "budget": 5200000
}
```
