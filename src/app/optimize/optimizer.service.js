(function() {
  'use strict';

  angular
  .module('wizweekPy')
  .service('optimizer', optimizer);

  /** @ngInject */
  function optimizer(GApi, settingsStore) {
    var service = {
      optimizeAndSync: optimizeAndSync
    };
    return service;

    function optimizeAndSync(tasks, msgCallback, doneCallback) {
      var settings;

      var startTaskSchedule = new Date();
      startTaskSchedule.setHours(startTaskSchedule.getHours() + 1);
      startTaskSchedule.setMinutes(0);
      var endTaskSchedule = new Date(startTaskSchedule);
      endTaskSchedule.setDate(startTaskSchedule.getDate() + 90);

      loadSettings();

      function loadSettings() {
        msgCallback('Loading settings...');
        settingsStore.load().then(function(loadedSettings) {
          settings = loadedSettings;
          loadEvents();
        });
      }

      function loadEvents() {
        loadAppointments();
        doneCallback();
      }

      function loadAppointments() {
        //GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events
        // timeMax, timeMin
        var calUrl = 'calendar/v3/calendars/' + settings.appointmentsCalId + '/events';
        var url = calUrl + "?timeMin=" + startTaskSchedule.toISOString() +
          "&timeMax=" + endTaskSchedule.toISOString();
        GApi.request(url).then(function() {
          // resp is first parameter
          //var events = resp.result.items;
          //var nonAllDayEvents = [];
          // Exclude events that have a start: { date in them }
        });

        msgCallback('Loading appointments...');
      }

      // function appointments(calendar, start, end) {
      //   var appts = [];
      //   var apptEvents = calendar.getEvents(start, end);
      //   for (var i = 0; i < apptEvents.length; i++) {
      //     apptEvent = apptEvents[i];
      //     if (!apptEvent.isAllDayEvent()) {
      //       appt = {
      //         title: apptEvent.getTitle(),
      //         start: apptEvent.getStartTime(),
      //         end: apptEvent.getEndTime()
      //       };
      //       appts.push(appt);
      //     }
      //   }
      //   logTime("appointments");
      //   return appts;
      // }
      //
    }
  }

  /*
     Next steps:

     Provide options for when to do the task schedule starting:
     - make schedule starting next hour
     - make schedule starting tomorrow
     - make schedule starting Monday
     - make schedule custom start ...

     Display messages essentially a progress tab

     Handle the "too many calendar interactions" error and deal with it??

     Make the onInstall initialize a default spreadsheet

     Test the whole onboarding user experience a few times.

     Deploy this as a Google app

     function weeklyTaskBlocks(configSheet) {
     var weeklyBlocks = [];
     for (var i = 0; i < 7; i++) {
     var dailyTaskBlocks = []
     var start = configSheet.getRange(5 + i, 2).getValue();
     var end = configSheet.getRange(5 + i, 3).getValue();
     if (start != '' && end != '') {
     taskBlock = {
start: formatHoursAndMinutes(start),
end: formatHoursAndMinutes(end)
};
dailyTaskBlocks.push(taskBlock);
}
weeklyBlocks.push(dailyTaskBlocks);
}
logTime("weekly task blocks");
return weeklyBlocks;
}

function appointments(calendar, start, end) {
var appts = [];
var apptEvents = calendar.getEvents(start, end);
for (var i = 0; i < apptEvents.length; i++) {
apptEvent = apptEvents[i];
if (!apptEvent.isAllDayEvent()) {
appt = {
title: apptEvent.getTitle(),
start: apptEvent.getStartTime(),
end: apptEvent.getEndTime()
};
appts.push(appt);
}
}
logTime("appointments");
return appts;
}

function tasks(taskSheet) {
var tasks = [];
var numTasks = taskSheet.getLastRow() - 1;
var tasksVals = taskSheet.getRange(2, 1, numTasks, 5).getValues();
for (var i = 0; i < numTasks; i++) {
vals = tasksVals[i];
var title = vals[0];
var hours = vals[1];
var reward = vals[2];
var deadline = vals[3];
var onOrAfter = vals[4];

if (title != '' && hours != '' && reward != '') {
var task = {
title: title,
estimatedHours: hours,
  reward: reward
  };

                if (deadline != '') {
                  deadline.setHours(23);
                  deadline.setMinutes(59);
                  task['deadline'] = deadline;
                }
                if (onOrAfter != '') {
                  task['onOrAfter'] = onOrAfter;
                }
                tasks.push(task);
  }
            }
          logTime("tasks");
          return tasks;
        }

function use() {
  logTime("start");

  var startTime = (new Date()).getTime();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var configSheet = ss.getSheetByName('Config');
  var appointmentsCalId = configSheet.getRange('B1').getValue();
  var tasksCalId = configSheet.getRange('B2').getValue();
  var appointmentsCal = CalendarApp.getCalendarById(appointmentsCalId);
  var tasksCal = CalendarApp.getCalendarById(tasksCalId);

  var startTaskSchedule = new Date();
  startTaskSchedule.setHours(startTaskSchedule.getHours() + 1);
  startTaskSchedule.setMinutes(0);

  var endTaskSchedule = new Date(startTaskSchedule);
  endTaskSchedule.setDate(startTaskSchedule.getDate() + 90);

  logTime("params");

  var params = JSON.stringify({
timeZone: tasksCal.getTimeZone(),
weeklyTaskBlocks: weeklyTaskBlocks(configSheet),
appointments: appointments(appointmentsCal, startTaskSchedule, endTaskSchedule),
tasks: tasks(ss.getSheetByName('Tasks')),
startTaskSchedule: startTaskSchedule,
endTaskSchedule: endTaskSchedule
});
Logger.log(params);

logTime("json");

var url = 'https://schedule-tasks.herokuapp.com';
var response = UrlFetchApp.fetch(url, { method: 'post', payload: params });

logTime("service");

var result = JSON.parse(response.getContentText());

logTime("parsed");

//Logger.log(result);

if ('err' in result) {
  var err = result['err'];
  var msg = err;
  if (err == 'Could not solve linear program') {
    msg = 'Cannot create a schedule with these constraints.';
  } else if (err == 'json: cannot unmarshal string into Go value of type float64') {
    msg = 'Bad value for estimated hours or reward field.';
  }
  SpreadsheetApp.getUi().alert(msg);
} else {
  updateTaskEvents(tasksCal, result, startTaskSchedule, endTaskSchedule);
}
}

function updateTaskEvents(tasksCal, events, startTaskSchedule, endTaskSchedule) {
  var existingEvents = tasksCal.getEvents(startTaskSchedule, endTaskSchedule);

  logTime("updating task events");

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var title = event['title'] + (event['finish'] ? ' - Finish' : '');
    var start = new Date(getDateFromIso(event['start']));
    var end = new Date(getDateFromIso(event['end']));

    if (i < existingEvents.length) {
      var existingEvent = existingEvents[i];
      if (existingEvent.getTitle() != title) {
        existingEvent.setTitle(title);
        logTime("set title");
      }
      var existingStart = existingEvent.getStartTime();
      var existingEnd = existingEvent.getEndTime();
      if (existingStart.getTime() != start.getTime() || existingEnd.getTime() != end.getTime()) {
        existingEvent.setTime(start, end);
        logTime("set time");
      }
    } else {
      logTime("creating..");
      var createdEvent = tasksCal.createEvent(title, start, end);
      logTime("created");
    }
  }

  if (existingEvents.length > events.length) {
    for (var i = events.length; i < existingEvents.length; i++) {
      logTime("deleting..");
      existingEvents[i].deleteEvent();
      logTime("deleted");
    }
  }
}

function formatHoursAndMinutes(dateStr) {
  var date = new Date(Date.parse(dateStr));
  Logger.log("parsing date:" + dateStr);
  Logger.log("parsed to: " + date);
  //Logger.log(typeof date);
  return (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}

// http://delete.me.uk/2005/03/iso8601.html
function getDateFromIso(string) {
  try{
    var aDate = new Date();
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
      "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
      "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
      offset = (Number(d[16]) * 60) + Number(d[17]);
      offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    return aDate.setTime(Number(time));
  } catch(e){
    return;
  }
}
*/
})();