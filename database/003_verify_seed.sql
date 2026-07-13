SELECT
    ro.code,
    ro.name,
    ro.max_guests,
    ro.nightly_price_lei,
    ro.cleaning_fee_lei,
    a.code AS apartment_code,
    a.name AS apartment_name
FROM rental_options ro
JOIN rental_option_apartments roa ON roa.rental_option_id = ro.id
JOIN apartments a ON a.id = roa.apartment_id
ORDER BY ro.code, a.code;
