create extension if not exists "pgcrypto";

create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    username text not null unique,
    email text not null unique,
    password text not null,
    created_at timestamptz not null default now()
);