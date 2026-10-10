const logs = [
  {"id":"1","userId":"2","date":"2026-10-03","status":"Delivered","updated_at":"2026-10-10T10:24:15.000000Z","tiffinId":"3"},
  {"id":"2","userId":"2","date":"2026-10-04","status":"Cancelled","updated_at":"2026-10-10T10:24:15.000000Z","tiffinId":"3"},
  {"id":"3","userId":"2","date":"2026-10-05","status":"Delivered","updated_at":"2026-10-10T10:24:15.000000Z","tiffinId":"3"},
  {"id":"4","userId":"2","date":"2026-10-06","status":"Delivered","updated_at":"2026-10-10T10:24:15.000000Z","tiffinId":"3"},
  {"id":"5","userId":"2","date":"2026-10-07","status":"Cancelled","updated_at":"2026-10-10T10:24:16.000000Z","tiffinId":"3"},
  {"id":"6","userId":"2","date":"2026-10-08","status":"Delivered","updated_at":"2026-10-10T10:24:16.000000Z","tiffinId":"3"},
  {"id":"7","userId":"2","date":"2026-10-09","status":"Delivered","updated_at":"2026-10-10T10:24:16.000000Z","tiffinId":"3"},
  {"id":"8","userId":"2","date":"2026-10-10","status":"Cancelled","updated_at":"2026-10-10T11:12:07.000000Z","tiffinId":"3"},
  {"id":"33","userId":"2","date":"2026-10-10","status":"Cancelled","updated_at":"2026-10-10T11:12:07.000000Z","tiffinId":"3"},
  {"id":"40","userId":"2","date":"2026-10-09","status":"Delivered","updated_at":"2026-10-10T10:56:23.000000Z","tiffinId":"3"},
  {"id":"41","userId":"2","date":"2026-10-08","status":"Delivered","updated_at":"2026-10-10T10:56:39.000000Z","tiffinId":"3"}
];

  const sortedLogs = [...logs].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
  });
  
  const userLogs = Object.values(sortedLogs.reduce((acc, log) => {
    const key = `${log.date}-${log.tiffinId}`;
    if (!acc[key]) {
      acc[key] = log;
    }
    return acc;
  }, {}));

  const now = new Date("2026-10-10T20:11:48+05:30"); // user time
  const currentMonthLogs = userLogs.filter(l => {
    const d = new Date(l.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  console.log("Sorted Logs:");
  sortedLogs.forEach(l => console.log(l.date, l.status, l.updated_at));
  
  console.log("User Logs (deduplicated):");
  userLogs.forEach(l => console.log(l.date, l.status, l.updated_at));

  console.log("Current Month Logs:");
  currentMonthLogs.forEach(l => console.log(l.date, l.status, l.updated_at));

  let deliveredMealsCount = 0;
  const tiffinLogs = currentMonthLogs.filter(l => l.status === "Delivered" && String(l.tiffinId) === "3");
  
  console.log("Total Delivered:", tiffinLogs.length);
  console.log("Total Bill:", tiffinLogs.length * 100);
