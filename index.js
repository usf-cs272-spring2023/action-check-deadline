const core = require('@actions/core');
const github = require('@actions/github');

const { DateTime } = require('luxon');
const zone = 'America/Los_Angeles';

const constants = require('./constants.js');

try {
  const assignment_name = core.getInput('assignment_name');
  console.log(`Assignment Name: ${assignment_name}`);

  if (!(assignment_name in constants.deadlines)) {
    throw new Error(`Unrecognized assignment: ${assignment_name}`);
  }

  const deadline = constants.deadlines[assignment_name];
  console.log(deadline);

  const submitted_date  = core.getInput('submitted_date');
  const starting_points = parseInt(core.getInput('starting_points'));
  const extension_hours = parseInt(core.getInput('extension_hours'));

  
  console.log(`Submitted Date:  ${submitted_date}`);
  console.log(`Starting Points: ${starting_points}`);
  console.log(`Extension Hours: ${extension_hours}`);

  core.setOutput('late_interval', 'hello');
  core.setOutput('late_multiplier', 'hello');
  core.setOutput('late_percent', 'hello');
  core.setOutput('late_points', 'hello');
  core.setOutput('grade_percent', 'hello');
  core.setOutput('grade_points', 'hello');
  core.setOutput('grade_possible', 'hello');
} catch (error) {
  core.setFailed(error.message);
}
