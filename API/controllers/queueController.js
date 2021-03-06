const queueDB = require('../models/queueDB');

module.exports = {
  index(req, res, next) {
    queueDB.findAll()
    .then(results => res.json({ message: "Getting all queued songs", data: results }))
    .catch(err => { console.log("Failed at Queue Index"); next(err); });
  },
  getOne(req, res, next) {
    queueDB.findById(req.params.id)
    .then(queue => res.json({ message: "Getting queued song", data: queue }))
    .catch(err => next(err));
  },
  getByChannel(req, res, next) {
    queueDB.checkForChannelQueue(req.params.channel)
    .then(results => {
      if(parseInt(results.count, 10) > 0)
        queueDB.findByChannel(req.params.channel)
        .then(queue => res.json({ message: "Getting channel queue", data: queue }))
      else res.json({ message: "No current queue", data: { count: "0" } })
    })
    .catch(err => next(err));
  },
  create(req, res, next) {
    queueDB.save(req.body)
    .then(queue => res.json({ message: "Adding to queue", data: queue }))
    .catch(err => next(err));
  },
  delete(req, res, next) {
    queueDB.destroy(req.params.id)
    .then(queue => res.json({ message: "Queue Item Deleted" }))
    .catch(err => next(err));
  }
}
