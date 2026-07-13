INSERT INTO apartments (code, name, max_guests, base_price_lei)
SELECT 'ibiza', 'Apartament IBIZA', 5, 530
WHERE NOT EXISTS (SELECT 1 FROM apartments WHERE code = 'ibiza');

INSERT INTO apartments (code, name, max_guests, base_price_lei)
SELECT 'rooftop', 'The Rooftop', 5, 530
WHERE NOT EXISTS (SELECT 1 FROM apartments WHERE code = 'rooftop');

INSERT INTO rental_options (code, name, description, max_guests, nightly_price_lei, cleaning_fee_lei)
SELECT
    'ibiza',
    'Apartament IBIZA',
    'Apartament de 110 mp, cu 2 dormitoare, 2 bai, living separat si bucatarie separata cu aragaz, potrivita pentru gatit.',
    5,
    530,
    0
WHERE NOT EXISTS (SELECT 1 FROM rental_options WHERE code = 'ibiza');

INSERT INTO rental_options (code, name, description, max_guests, nightly_price_lei, cleaning_fee_lei)
SELECT
    'rooftop',
    'The Rooftop',
    'Penthouse de 100 mp, cu 2 dormitoare, 2 bai, terasa rooftop de 80 mp si chicineta fara plita sau aragaz, cu frigider mic, mobilier si chiuveta.',
    5,
    530,
    0
WHERE NOT EXISTS (SELECT 1 FROM rental_options WHERE code = 'rooftop');

INSERT INTO rental_options (code, name, description, max_guests, nightly_price_lei, cleaning_fee_lei)
SELECT
    'villa',
    'Villa',
    'Ambele apartamente impreuna, pentru maximum 10 persoane, cu acces la curte si spatiile exterioare disponibile.',
    10,
    1060,
    100
WHERE NOT EXISTS (SELECT 1 FROM rental_options WHERE code = 'villa');

INSERT INTO rental_option_apartments (rental_option_id, apartment_id)
SELECT ro.id, a.id
FROM rental_options ro
JOIN apartments a ON a.code = 'ibiza'
WHERE ro.code = 'ibiza'
AND NOT EXISTS (
    SELECT 1
    FROM rental_option_apartments roa
    WHERE roa.rental_option_id = ro.id
    AND roa.apartment_id = a.id
);

INSERT INTO rental_option_apartments (rental_option_id, apartment_id)
SELECT ro.id, a.id
FROM rental_options ro
JOIN apartments a ON a.code = 'rooftop'
WHERE ro.code = 'rooftop'
AND NOT EXISTS (
    SELECT 1
    FROM rental_option_apartments roa
    WHERE roa.rental_option_id = ro.id
    AND roa.apartment_id = a.id
);

INSERT INTO rental_option_apartments (rental_option_id, apartment_id)
SELECT ro.id, a.id
FROM rental_options ro
JOIN apartments a ON a.code IN ('ibiza', 'rooftop')
WHERE ro.code = 'villa'
AND NOT EXISTS (
    SELECT 1
    FROM rental_option_apartments roa
    WHERE roa.rental_option_id = ro.id
    AND roa.apartment_id = a.id
);
