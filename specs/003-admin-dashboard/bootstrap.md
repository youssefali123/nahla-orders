# First-Manager Bootstrap (manual, one-time)

The dashboard has no self-registration. Create the first manager in two steps:

## 1. Create the auth user

Supabase Dashboard → Authentication → Users → **Add user** → **Create new user**.
Enter the manager's email + a strong password. Leave **Auto Confirm User**
checked. Copy the new user's **UID**. 66a98079-6d1a-4b3d-9334-7d07bf2781e2

## 2. Grant the admin role

Supabase Dashboard → SQL Editor → run:

```sql
insert into admin_profiles (id) values ('<PASTE-AUTH-USER-UID>');
```

Verify:

```sql
select * from admin_profiles;
```

The manager can now sign in at `/admin/login`. Repeat for each additional
manager. Never insert rows for anyone else; never expose this step publicly.
