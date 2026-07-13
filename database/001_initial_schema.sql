CREATE TABLE IF NOT EXISTS apartments (
    id serial PRIMARY KEY,
    code varchar(50) NOT NULL UNIQUE,
    name varchar(120) NOT NULL,
    max_guests integer NOT NULL,
    base_price_lei numeric(10,2) NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rental_options (
    id serial PRIMARY KEY,
    code varchar(50) NOT NULL UNIQUE,
    name varchar(120) NOT NULL,
    description text NOT NULL,
    max_guests integer NOT NULL,
    nightly_price_lei numeric(10,2) NOT NULL,
    cleaning_fee_lei numeric(10,2) NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rental_option_apartments (
    rental_option_id integer NOT NULL REFERENCES rental_options(id) ON DELETE CASCADE,
    apartment_id integer NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    PRIMARY KEY (rental_option_id, apartment_id)
);

CREATE TABLE IF NOT EXISTS blocked_periods (
    id serial PRIMARY KEY,
    apartment_id integer NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    starts_on date NOT NULL,
    ends_on date NOT NULL,
    reason text,
    source varchar(30) NOT NULL DEFAULT 'admin',
    created_at timestamp NOT NULL DEFAULT now(),
    CHECK (ends_on > starts_on)
);

CREATE TABLE IF NOT EXISTS festival_periods (
    id serial PRIMARY KEY,
    name varchar(120) NOT NULL,
    starts_on date NOT NULL,
    ends_on date NOT NULL,
    is_non_refundable boolean NOT NULL DEFAULT true,
    minimum_nights integer,
    created_at timestamp NOT NULL DEFAULT now(),
    CHECK (ends_on > starts_on)
);

CREATE TABLE IF NOT EXISTS reservations (
    id serial PRIMARY KEY,
    rental_option_id integer NOT NULL REFERENCES rental_options(id),
    check_in date NOT NULL,
    check_out date NOT NULL,
    guests integer NOT NULL,
    guest_first_name varchar(120),
    guest_last_name varchar(120),
    guest_email varchar(160),
    guest_phone varchar(60),
    status varchar(30) NOT NULL DEFAULT 'pending',
    source varchar(30) NOT NULL DEFAULT 'direct',
    payment_status varchar(30) NOT NULL DEFAULT 'unpaid',
    total_lei numeric(10,2) NOT NULL DEFAULT 0,
    deposit_lei numeric(10,2) NOT NULL DEFAULT 0,
    notes text,
    created_at timestamp NOT NULL DEFAULT now(),
    CHECK (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS reservation_apartments (
    reservation_id integer NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    apartment_id integer NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    PRIMARY KEY (reservation_id, apartment_id)
);

CREATE TABLE IF NOT EXISTS price_rules (
    id serial PRIMARY KEY,
    rental_option_id integer NOT NULL REFERENCES rental_options(id) ON DELETE CASCADE,
    starts_on date NOT NULL,
    ends_on date NOT NULL,
    nightly_price_lei numeric(10,2) NOT NULL,
    minimum_nights integer,
    label varchar(120),
    created_at timestamp NOT NULL DEFAULT now(),
    CHECK (ends_on > starts_on)
);

CREATE TABLE IF NOT EXISTS promo_codes (
    id serial PRIMARY KEY,
    code varchar(80) NOT NULL UNIQUE,
    discount_type varchar(20) NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    starts_on date,
    ends_on date,
    max_uses integer,
    used_count integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
    id serial PRIMARY KEY,
    email varchar(160) NOT NULL UNIQUE,
    password_hash text NOT NULL,
    name varchar(120),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp NOT NULL DEFAULT now()
);
