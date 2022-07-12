const inquirer = require('inquirer');

// prompt user
const promptUser = () => {
    inquirer.prompt({
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Update Employee Role', 'View Departments', 'Add Department', 'View Roles', 'Add Role', 'I am finished']
        })

        .then((data) => {
            switch (data['choices']) {
                case 'View All Employees':
                    allEmployees();
                    break;
                case 'View All Employees By Department':
                    employeeByDepartment();
                    break;
                case 'View All Employees By Manager':
                    employeeByManager();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View Departments':
                    viewDepartment();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'View Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'I am finished':
                    break;
            }
        })
};


module.exports = { promptUser }
const { allEmployees, employeeByDepartment, employeeByManager, addEmployee, updateEmployee } = require('./lib/employee');
const { viewDepartment, addDepartment } = require('./lib/department');
const { viewRoles, addRole } = require('./lib/roles');

promptUser()