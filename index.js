const core = require('@actions/core');
const github = require('@actions/github');

const { DateTime } = require('luxon');
const zone = 'America/Los_Angeles';
const eod = 'T23:59:59';

const constants = require('./constants.js');

try {
  // lookup assignment
  const assignment_name = core.getInput('assignment_name');

  if (!(assignment_name in constants.deadlines)) {
    throw new Error(`Unrecognized assignment: ${assignment_name}`);
  }

  const assignment = constants.deadlines[assignment_name];
  console.log(`Assignment Name: ${assignment_name}`);

  // process deadline and possible extension
  let deadline_date = DateTime.fromISO(`${assignment.due}${eod}`, {zone: zone});
  let deadline_text = deadline_date.toLocaleString(DateTime.DATETIME_FULL);
  console.log(`       Deadline: ${deadline_text}`);

  const extension_hours = parseInt(core.getInput('extension_hours'));

  if (extension_hours > 0) {
    deadline_date = deadline_date.plus({hours: extension_hours}).toISODate();;
    deadline_text = deadline_date.toLocaleString(DateTime.DATETIME_FULL);

    console.log(`       Extended: ${deadline_text}`);
  }

  // process submitted date
  const submitted = core.getInput('submitted_date')
  const submitted_date = DateTime.fromISO(submitted).setZone(zone);
  const submitted_text = submitted_date.toLocaleString(DateTime.DATETIME_FULL);

  if (!submitted_date.isValid) {
    throw new Error(`Unable to parse submitted date: ${submitted} (${submitted_date.invalidReason})`);
  }

  console.log(`      Submitted: ${submitted_text}\n`);
  
  // process possible and starting points
  const possible = parseInt(assignment.max);
  const starting_points = parseInt(core.getInput('starting_points'));

  console.log(`       Possible: ${possible} Points`);
  console.log(`       Starting: ${starting_points} Points`);

  // calculate late grade
  let late_interval = 0;
  let late_multiplier = 0;
  let late_percent = 0;
  let late_points = 0;


  // calculate earned grade (make sure not negative)
  let grade_points = Math.max(starting_points - late_points, 0);
  let grade_percent = grade_points / possible;

  console.log(`   Earned Grade: ${grade_points} Points (${Math.round(grade_percent * 100)})%`);

  // set output
  core.setOutput('grade_possible', `${possible}`);

  core.setOutput('deadline_date', deadline_date.toISO());
  core.setOutput('deadline_text', deadline_text);

  core.setOutput('submitted_date', submitted_date.toISO());
  core.setOutput('submitted_text', submitted_text);

  core.setOutput('late_interval',   `${late_interval}`);
  core.setOutput('late_multiplier', `${late_multiplier}`);
  core.setOutput('late_percent',    `${late_percent}`);
  core.setOutput('late_points',     `${late_points}`);

  core.setOutput('grade_percent', `${grade_percent}`);
  core.setOutput('grade_points', `${grade_points}`);
} catch (error) {
  core.setFailed(error.message);
}
