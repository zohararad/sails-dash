/**
 * MetricController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MetricController)
   */
  _config: {
    blueprints: {
      actions: false,
      pluralize: true,
      shortcuts: true
    }
  },

  create: function(req, res){
    "use strict";
    Metric.findOne({type: req.param("type")}, function(err, metric){
      var measurement = [new Date().getTime(), req.param("measurement")];
      if(metric){
        metric.measurements.push(measurement);
        metric.save(function(err){
          Metric.publishCreate(metric.toJSON());
          res.json(metric);
        });
      } else {
        metric = Metric.create({
          type: req.param("type"),
          measurements: [measurement]
        }).done(function(err, metric){
          Metric.publishCreate(metric.toJSON());
          res.json(metric);
        });
      }
    });
  }

};
