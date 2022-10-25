exports.deadlines = {
  // homework
  'Template':         {'max': 100, 'due': '2022-08-12'},
  'ArgumentParser':   {'max': 100, 'due': '2022-09-02'},
  'WordCleaner':      {'max': 100, 'due': '2022-09-09'},
  'WordIndex':        {'max': 100, 'due': '2022-09-16'},
  'PrettyJsonWriter': {'max': 100, 'due': '2022-09-23'},
  'FileSorter':       {'max': 100, 'due': '2022-09-30'},
  'FileFinder':       {'max': 100, 'due': '2022-10-07'},
  'LinkFinder':       {'max': 100, 'due': '2022-10-14'},
  'HtmlCleaner':      {'max': 100, 'due': '2022-10-21'},
  'LoggerSetup':      {'max': 100, 'due': '2022-10-28'},
  'ReadWriteLock':    {'max': 100, 'due': '2022-11-04'},
  'PrimeFinder':      {'max': 100, 'due': '2022-11-11'},
  'HtmlFetcher':      {'max': 100, 'due': '2022-11-18'},

  // projects
  'Project 1 Tests':    {'max': 100, 'due': '2022-09-20'},
  'Project 1 Review 1': {'max':  30, 'due': '2022-09-27'},
  'Project 1 Review 2': {'max':  20, 'due': '2022-10-04'},
  'Project 1 Design':   {'max':  50, 'due': '2022-10-11'},

  'Project 2 Tests':    {'max': 100, 'due': '2022-10-25'},
  'Project 2 Review 1': {'max':  30, 'due': '2022-11-01'},
  'Project 2 Review 2': {'max':  20, 'due': '2022-11-08'},
  'Project 2 Design':   {'max':  50, 'due': '2022-11-15'},

  'Project 3 Tests':    {'max': 100, 'due': '2022-11-15'},
  'Project 3 Review 1': {'max':  30, 'due': '2022-11-22'},
  'Project 3 Review 2': {'max':  20, 'due': '2022-11-29'},
  'Project 3 Design':   {'max':  50, 'due': '2022-12-06'},

  'Project 4 Tests':    {'max': 100, 'due': '2022-12-06'},
};

exports.penalty = {
  'percent':  0.02, // percent deduction
  'maximum':  0.26, // maximum deduction  (in percent)
  'interval': 24,   // deduction interval (in hours)
};
