const core = require('@actions/core');
const github = require('@actions/github');

const { DateTime } = require('luxon');
const zone = 'America/Los_Angeles';
const eod = 'T23:59:59';

const constants = require('./constants.js');

try {
  // lookup assignment and points possible
  const assignment_name = core.getInput('assignment_name');

  if (!(assignment_name in constants.deadlines)) {
    throw new Error(`Unrecognized assignment: ${assignment_name}`);
  }

  const assignment = constants.deadlines[assignment_name];
  const possible = parseInt(assignment.max);

  console.log(`Assignment Name: ${assignment_name}`);
  console.log(`       Possible: ${possible} Points\n`);

  core.setOutput('grade_possible', '${possible}');

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

  core.setOutput('deadline_date', deadline_date.toISO());
  core.setOutput('deadline_text', deadline_text);

  // process submitted date
  const submitted = core.getInput('submitted_date')
  const submitted_date = DateTime.fromISO(submitted).setZone(zone);
  const submitted_text = submitted.toLocaleString(DateTime.DATETIME_FULL);

  if (!submitted_date.isValid) {
    throw new Error(`Unable to parse submitted date: ${submitted} (${submitted_date.invalidReason})`);
  }

  console.log(`      Submitted: ${submitted_text}\n`);
  core.setOutput('submitted_date', submitted_date);
  core.setOutput('submitted_text', submitted_text);
  
  const starting_points = parseInt(core.getInput('starting_points'));

  console.log(` Submitted Date: ${submitted_text}`);
  console.log(`Starting Points: ${starting_points}`);
  console.log(`Extension Hours: ${extension_hours}`);



  core.setOutput('late_interval', 'hello');
  core.setOutput('late_multiplier', 'hello');
  core.setOutput('late_percent', 'hello');
  core.setOutput('late_points', 'hello');

  core.setOutput('grade_percent', 'hello');
  core.setOutput('grade_points', 'hello');
} catch (error) {
  core.setFailed(error.message);
}
