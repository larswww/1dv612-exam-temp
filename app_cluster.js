let cluster = require('cluster');

function startWorker() {
  let worker = cluster.fork();
  console.log('CLUSTER: Worker %d started', worker.id);
}

if (cluster.isMaster) {
  require('os').cpus().forEach(function () {
      startWorker();
    });

  // log disconnect, wait for exit event, replace
  cluster.on('disconnect', function (worker) {
      console.log('CLUSTER: Worker %d disconnected from the cluster.', worker.id);
    });

  cluster.on('exit', function (worker, code, signal) {
      console.log('CLUSTER: Worker %d died with exit code %d (%s)', worker.id, code, signal);
      startWorker();
    });
} else {
  // start app on worker
  require('./app.js')();
}
