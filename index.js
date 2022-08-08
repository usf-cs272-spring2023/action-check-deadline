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
  console.log(`Assignment: ${assignment_name}`);

  // process deadline and possible extension
  let deadline_date = DateTime.fromISO(`${assignment.due}${eod}`, {zone: zone});
  let deadline_text = deadline_date.toLocaleString(DateTime.DATETIME_FULL);
  console.log(`  Deadline: ${deadline_text}`);

  if (!deadline_date.isValid) {
    throw new Error(`Unable to parse deadline date: ${assignment.due}${eod} (${deadline_date.invalidReason})`);
  }

  const extension_hours = parseFloat(core.getInput('extension_hours'));

  if (extension_hours > 0) {
    deadline_date = deadline_date.plus({hours: extension_hours}).toISODate();;
    deadline_text = deadline_date.toLocaleString(DateTime.DATETIME_FULL);

    console.log(`  Extended: ${deadline_text}`);
  }

  // TODO Check grade percent works
  // TODO Check invalid assignment name
  // TODO Check invalid submitted date
  // TODO Check 0 or negative points
  // TODO Add in late calculation

  // process submitted date
  const submitted = core.getInput('submitted_date')
  const submitted_date = DateTime.fromISO(submitted).setZone(zone);
  const submitted_text = submitted_date.toLocaleString(DateTime.DATETIME_FULL);

  if (!submitted_date.isValid) {
    throw new Error(`Unable to parse submitted date: ${submitted} (${submitted_date.invalidReason})`);
  }

  console.log(` Submitted: ${submitted_text}\n`);
  
  // process possible and starting points
  const possible_points = parseFloat(assignment.max);
  const starting_points = parseFloat(core.getInput('starting_points'));

  if (!(possible_points > 0)) {
    throw new Error(`Possible points must be positive: ${possible_points}`);
  }

  if (!(starting_points) > 0) {
    throw new Error(`Starting points must be positive: ${starting_points}`);
  }

  console.log(`  Possible: ${possible_points} Points`);
  console.log(`  Starting: ${starting_points} Points\n`);

  let late_interval   = 0;
  let late_multiplier = 0;
  let late_percent    = 0;
  let late_points     = 0;

  if (submitted_date > deadline_date) {
    // calculate late penalties
    const late_penalty = Number.parseFloat(constants.penalty.percent * possible_points).toFixed(1);
    const late_maximum = Number.parseFloat(constants.penalty.maximum * possible_points).toFixed(1);

    console.log(`  Penalty: -${late_penalty} Points (-${constants.penalty.percent}%) Per ${constants.penalty.interval} Hours Late`);
    console.log(`  Maximum: -${late_maximum} Points (-${constants.penalty.maximum}%)\n`);

    // calculate late grade
    const late_diff = submitted_date.diff(deadline_date, 'hours');
    late_interval   = late_diff.toObject().hours;
    late_multiplier = Math.ceil(late_interval / constants.penalty.interval);

    late_points = Math.min(late_maximum, late_multiplier * late_penalty);
    late_percent = Number.parseFloat(late_points / possible_points * 100).toFixed(1);

    console.log(`  Duration: ${late_interval} Hours Late (x${late_multiplier})`);
    console.log(` Deduction: -${late_points} Points (-${late_percent}%)\n`);
  }

  // calculate earned grade (make sure not negative)
  let grade_points  = Math.max(starting_points - late_points, 0);
  let grade_percent = Number.parseFloat(grade_points / possible_points * 100).toFixed(1);

  console.log(`    Earned: ${grade_points} Points (${grade_percent}%)`);

  // set output
  core.setOutput('grade_possible', `${possible_points}`);

  core.setOutput('deadline_date', deadline_date.toISO());
  core.setOutput('deadline_text', deadline_text);

  core.setOutput('submitted_date', submitted_date.toISO());
  core.setOutput('submitted_text', submitted_text);

  core.setOutput('late_interval',   `${late_interval}`);
  core.setOutput('late_multiplier', `${late_multiplier}`);
  core.setOutput('late_percent',    `${late_percent}`);
  core.setOutput('late_points',     `${late_points}`);

  core.setOutput('grade_percent', `${grade_percent}`);
  core.setOutput('grade_points',  `${grade_points}`);

  if (late_interval === 0) {
    core.notice(`${assignment_name}: ${grade_points} / ${possible_points} (${grade_percent}%)`);
  }
  else {
    core.warning(`${assignment_name}: ${grade_points} / ${possible_points} (${grade_percent}%)\nLate Penalty: -${late_points} Points`);
  }
} catch (error) {
  core.setFailed(error.message);
}
