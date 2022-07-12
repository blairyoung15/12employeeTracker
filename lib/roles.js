const { promptUser } = require('../index');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeetracker'
});

// view current roles in database 
const viewRoles = () => {
    connection.query(
        `SELECT roles.id, roles.title, roles.salary, department.name
            FROM roles
            LEFT JOIN department
            ON roles.department_id = department.id `,
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

// add a new role to the database, promted with questions about role name, salary and the department
const addRole = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return;
            }

            let depArr = [];
            results.forEach(item => {
                depArr.push(item.name)
            })

            inquirer
                .prompt([
                    {
                        type: 'text',
                        name: 'role_title',
                        message: 'Enter the name of the role being added'
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Enter the salary for the role'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Select the department the role will be in',
                        choices: depArr
                    }
                ])
                .then((data) => {
                    let department_id;

                    for (let i = 0; i < depArr.length; i++) {
                        if (depArr[i] === data.department) {
                            department_id = i + 1;
                        };
                    };

                    connection.query(
                        `INSERT INTO roles (title, salary, department_id)
                            VALUES(?,?,?)`,
                        [data.role_title, data.salary, department_id],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.log('Role has been added!')
                            promptUser();
                        }
                    );
                });
        }
    );
};

module.exports = { viewRoles, addRole };