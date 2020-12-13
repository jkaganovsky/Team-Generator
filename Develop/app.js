const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employeeList = [];

// General questions prompted at start of application
function generateUser() {
    inquirer
        .prompt([
            {
                name: 'role',
                type: 'list',
                message: 'What is the role of the employee you are adding to the team?',
                choices: [
                        "Manager",
                        "Engineer",
                        "Intern",
                        ],
            },
            {
                type: 'input',
                message: 'What is the name of the employee?',
                name: 'name',
            },
            {
                type: 'input',
                message: 'What is the employee ID of the employee you are adding?',
                name: 'id',
            },
            {
                type: 'input',
                message: 'What is the e-mail of the employee?',
                name: 'email',
            },
      ])
        .then((user) => {
            if (user.role === "Manager") {
                return renderManager(user);
            }
            else if (user.role === "Engineer") {
                return renderEngineer(user);
            }
            else if (user.role === "Intern") {
                return renderIntern(user);
            }
        });

    }

generateUser();

function EmployeeChoice() {
    return inquirer
        .prompt([
            {
                name: "addTeam",
                message: "Would you like to add a new team member?",
                type: "confirm",
            }
        ])
        .then((response) => {
            if (response.addTeam) {
                generateUser();
            }
            else {
                createHtmlFile();
                return;
            }
        });
}

// Manager question
function renderManager(teamChoice) {
    return inquirer
        .prompt([
            {
                name: "number",
                message: "What is your office number?",
                type: 'input',
            }
        ])
        .then((managerData) => {
            const manager = new Manager(teamChoice.name, teamChoice.id, teamChoice.email, managerData.number);

            employeeList.push(manager);

            EmployeeChoice();

            // console.log(employeeList);
            })
};

// Engineer question
function renderEngineer(response) {
    return inquirer
        .prompt([
            {
                name: "github",
                message: "What is your github username?",
                type: 'input',
            }
        ])
        .then((engineerData) => {
            const engineer = new Engineer(response.name, response.id, response.email, engineerData.github);

            employeeList.push(engineer);

            EmployeeChoice();

            // console.log(employeeList);
            })
};

// Intern question
function renderIntern(response) {
    return inquirer
        .prompt([
            {
                name: "school",
                message: "What school do you go to?",
                type: 'input',
            }
        ])
        .then((internData) => {
            const intern = new Intern(response.name, response.id, response.email, internData.school);

            employeeList.push(intern);

            EmployeeChoice();

            // console.log(employeeList);
            })
};

function createHtmlFile() {
    const htmlContent = render(employeeList);

    fs.writeFile( outputPath, htmlContent, (err) =>
    err ? console.error("Failed to create a HTML file.") : console.error("New HTML file created!") );
};
