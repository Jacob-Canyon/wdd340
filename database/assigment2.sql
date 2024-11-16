--Add new account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    ) --Modify account_type
UPDATE account
SET account_type = 'admin'
WHERE account_id = 1 -- delete account
DELETE FROM account
WHERE account_lastname = 'Stark' --Modify Hummer description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    ) -- inner join 
SELECT inv_make,
    inv_model,
    classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2 -- Correct image address
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/')