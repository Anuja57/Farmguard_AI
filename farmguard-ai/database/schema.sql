create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  password text not null,
  phone text,
  location text,
  language text default 'English'
);

create table if not exists disease_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  crop_name text not null,
  disease text not null,
  treatment text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists weather_logs (
  id uuid primary key default uuid_generate_v4(),
  location text not null,
  temperature numeric,
  humidity integer,
  rainfall numeric,
  date date default current_date
);

create table if not exists market_prices (
  id uuid primary key default uuid_generate_v4(),
  crop_name text not null,
  market text not null,
  price numeric not null,
  date date default current_date
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  message text not null,
  status text default 'unread',
  created_at timestamptz default now()
);

