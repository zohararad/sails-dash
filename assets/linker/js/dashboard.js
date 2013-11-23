/*global jQuery */
(function($, socket){
  "use strict";

  var Dashboard = {
    container: $('.widgets'),
    widgets:{},
    rows: [],
    init: function(){

      // add a single row to start with
      this.addRow();

      socket.get('/metrics', function(metrics){
        console.log('got metrics', metrics);
        this.addWidgets(metrics);
      }.bind(this));
    },
    addRow: function(){
      var row = {
        el: $('<div class="row" />'),
        charts: []
      };
      this.container.append(row.el);
      this.rows.unshift(row);
    },
    updateWidget: function(plot, measurements){
      console.log(plot, measurements);
      plot.setData([measurements]);
      plot.setupGrid();
      plot.draw();
    },
    addWidget: function(widget){
      var id = 'widget-' + widget.type,
          col = $('<section class="col-md-4"><header><h2>' + widget.type + '</h2></header><div class="plot" id="'+id+'"></div></section>'),
          row = this.rows[0];
      row.el.append(col);
      row.charts.push(1);
      this.widgets[widget.type] = $.plot('#' + id, [widget.measurements], {
        series: {
          shadowSize: 0
        },
        xaxis: {
          mode: "time"
        }
      });
    },
    addWidgets: function(widgets){
      widgets.forEach(function(widget){
        var row = this.rows[0];
        if(row.charts.length === 3){
          this.addRow();
        }
        this.addWidget(widget);
      }.bind(this));
    },
    update: function(metric){
      if(this.widgets[metric.type]){
        this.updateWidget(this.widgets[metric.type], metric.measurements);
      } else {
        this.addWidget(metric);
      }
    }
  };

  Dashboard.init();
  window.Dashboard = Dashboard;

}(jQuery, window.socket));