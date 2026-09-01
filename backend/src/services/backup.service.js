const cron = require("node-cron");

function startBackupCron() {
  cron.schedule("0 2 * * *", () => {
    console.log("Running nightly backup...");
  });
}

module.exports = {
  startBackupCron,
};
