const { promptUser } = require('../index')
const inquirer = require('inquirer');
const mysql = require('mysql2');
const { dropManager, createManager, addManager } = require('./manager');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeetracker'
});

// view all employees 
const allEmployees = () => {

    connection.query(

        `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, manager.first_name AS manager,
        department.name AS department 
        FROM employee
        LEFT JOIN roles
        ON employee.role_id = roles.id
        LEFT JOIN department
        ON roles.department_id = department.id
        LEFT JOIN manager
        ON employee.manager_id = manager.id`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    );
};


// find employee by department

const employeeByDepartment = () => {

    connection.query(
        `SELECT * FROM department`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            depArr = [];
            results.forEach(item => {
                depArr.push(item.name)
            });
            inquirer
                .prompt({
                    type: 'list',
                    name: 'department',
                    message: 'Select a department:',
                    choices: depArr
                })
                .then((data) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department 
                            FROM employee
                            LEFT JOIN roles
                            ON employee.role_id = roles.id
                            LEFT JOIN department
                            ON roles.department_id = department.id
                            WHERE department.name = ?`,
                        [data['department']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.table(results);
                            promptUser();
                        }
                    )
                });
        }
    );
};

// view employee by manager

const employeeByManager = () => {
    connection.query(
        `SELECT * FROM manager`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            manArr = [];
            results.forEach(item => {
                manArr.push(item.first_name)
            })

            inquirer
                .prompt({
                    type: 'list',
                    name: 'manager',
                    message: 'Choose a manager to filter from:',
                    choices: manArr
                })
                .then((data) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, manager.first_name AS manager
                            FROM employee
                            LEFT JOIN manager
                            ON employee.manager_id = manager.id
                            WHERE manager.first_name = ?`,
                        [data['manager']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.table(results);
                            promptUser();
                        }
                    );
                });

        }
    );
};

// add a new employee to database 
const addEmployee = () => {

    connection.query(
        `SELECT * FROM roles`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            let roleArr = [];

            results.forEach(item => {
                roleArr.push(item.title)
            })
            connection.query(
                `SELECT * FROM manager`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    let manArr = [];

                    results.forEach(item => {
                        manArr.push(item.first_name)
                    });

                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'first_name',
                                message: 'Enter the employees first name'
                            },
                            {
                                type: 'text',
                                name: 'last_name',
                                message: 'Enter the employees last name'
                            },
                            {
                                type: 'list',
                                name: 'role_pick',
                                message: 'Enter the role for the new employee',
                                choices: roleArr
                            },
                            {
                                type: 'confirm',
                                name: 'mngt_confirm',
                                message: 'Is the employee a manager?'
                            },
                            {
                                type: 'list',
                                name: 'mngt_pick',
                                message: 'Who is the manager for this employee?',
                                when: ({ mngt_confirm }) => {
                                    if (!mngt_confirm) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
                                choices: manArr
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (i = 0; i < roleArr.length; i++) {
                                if (data.role_pick === roleArr[i]) {
                                    role_id = i + 1
                                }
                            }

                            let manager_confirm;
                            if (data.mngt_confirm === true) {
                                manager_confirm = 1;
                            } else {
                                manager_confirm = 0
                            }

                            let manager_id;

                            if (!data.mngt_pick) {
                                manager_id = null;
                            } else {
                                for (i = 0; i < manArr.length; i++) {
                                    if (data.mngt_pick === manArr[i]) {
                                        manager_id = i + 1
                                    }
                                }
                            }
                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id, manager_confirm)
                                    VALUES (?, ?, ?, ?, ?)`,
                                [data.first_name, data.last_name, role_id, manager_id, manager_confirm],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    dropManager();
                                    createManager();
                                    addManager();
                                    console.log('Employee added!');
                                    promptUser();
                                }
                            );
                        });
                }
            );
        }
    );
};

const updateEmployee = () => {
    connection.query(
        `SELECT * FROM roles`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            let roleArr = [];
            results.forEach(item => {
                roleArr.push(item.title)
            })
            connection.query(
                `SELECT first_name, last_name FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }

                    let nameArr = [];
                    results.forEach(item => {
                        nameArr.push(item.first_name);
                        nameArr.push(item.last_name);
                    })
                    let combinedNameArr = [];
                    for (let i = 0; i < nameArr.length; i += 2) {
                        if (!nameArr[i + 1])
                            break
                        combinedNameArr.push(`${nameArr[i]} ${nameArr[i + 1]}`)
                    }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'name_select',
                                message: 'Please select an employee you would like to update',
                                choices: combinedNameArr
                            },
                            {
                                type: 'list',
                                name: 'role_select',
                                message: 'Please select a role you would like your employee to change to:',
                                choices: roleArr
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (let i = 0; i < roleArr.length; i++) {
                                if (data.role_select === roleArr[i]) {
                                    role_id = i + 1;
                                }
                            };
                            let selectedNameArr = data.name_select.split(" ");
                            let last_name = selectedNameArr.pop();
                            let first_name = selectedNameArr[0];

                            connection.query(
                                `UPDATE employee 
                                        SET role_id = ?
                                        WHERE first_name = ? AND last_name = ?`,
                                [role_id, first_name, last_name],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee updated!');
                                    promptUser();
                                }
                            );
                        });
                }
            );

        }
    );
};

module.exports = { allEmployees, employeeByDepartment, employeeByManager, addEmployee, updateEmployee };
