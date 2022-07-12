INSERT INTO department (name)
VALUES ('Sales'),
    ('Engineering'),
    ('Administrative');
INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Manager', 75000, 1),
    ('Sales Associate', 50000, 1),
    ('Software Engineer', 100000, 2),
    ('Junior Software Engineer', 60000, 2),
    ('Accountant', 75000, 3),
    ('Administrative Assistant', 45000, 3);
INSERT INTO employee (
        first_name,
        last_name,
        role_id,
        manager_id,
        manager_confirm
    )
VALUES ('Mickey', 'Mouse', 1, null, true),
    ('Donald', 'Duck', 2, 1, false),
    ('Snow', 'White', 2, 1, false),
    ('Jimmy', 'Cricket', 3, null, true),
    ('Clarabelle', 'Cow', 4, 2, false),
    ('PJ', 'Pete', 4, 2, false),
    ('Clara', 'Cluck', 4, 2, false),
    ('Mortimer', 'Mouse', 5, null, true),
    ('Max', 'Goof', 6, 3, false),
    ('Oswald', 'Rabbit', 6, 3, false);
INSERT INTO manager (first_name, last_name)
SELECT first_name,
    last_name
FROM employee
WHERE manager_confirm = 1;