
'use strict';

angular.module('MyBot')

.controller('LogsController', ['$scope', 'LogsFactory', function ($scope, LogsFactory) {
$scope.message = 'Loading...';
$scope.showMenu = false;
console.log(' controller starts');
LogsFactory.query(
    function (response) {
        $scope.logs = response;
        $scope.days = [];

        var glog = $scope.logs;
        
        console.log('days ',$scope.days);

        $scope.logs.sort(function(a, b){
            return b.time - a.time
        })

        var lastDay = moment($scope.logs[0].time).startOf('day');
        var firstDay = moment($scope.logs[$scope.logs.length -1].time).startOf('day')

        console.log('num of days --',moment.duration(lastDay - firstDay).asDays());
        for (var i = 0; i <=  moment.duration(lastDay - firstDay).asDays() ; i++) {

            $scope.days.push(moment($scope.logs[0].time).subtract(i, 'days').valueOf());
        }

        $scope.showMenu = true;
    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });

    $scope.all = true;

    $scope.setDay = function(day){
    $scope.thisDay = day;
    $scope.all = false;
    }

    $scope.isSelected = function(day){
        if ($scope.all){return $scope.all}else{
        return (day==$scope.thisDay)
    }
    }

    $scope.allTime = function(){
        $scope.all = true;
    }

    $scope.filterFn = function(lo){
        if($scope.all){
            return true;
        }else{
        return moment($scope.thisDay).isSame(lo.time , 'day');
    }
    }
 
}])

.controller('StatisticsController', ['$scope', 'LogsFactory', function ($scope, LogsFactory){

    console.log('statistics controller starts');

    LogsFactory.query(
    function (response) {
        $scope.logs = response;     
        console.log('logs ',$scope.logs);

    $scope.work = $scope.logs.filter(function(log){
        return log.activity.type == "work";
        
    });

    let rows = $scope.work.map(function(elem){
        let temp = [new Date(elem.time) , (elem.span || 0) / (1000*60)];
        console.log('temp ',temp);
        return temp;
    })
    console.log(' work -- ', $scope.work);
     google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'time');
        data.addColumn('number', 'time spent (min)');
        data.addRows(rows);

        var formatter = new google.visualization.DateFormat({formatType: 'medium'});

        formatter.format(data,1);
        // Set chart options
        var options = {'title':'Work',
                       curveType: 'none',
                       legend: { position: 'bottom' },
                       font:22,
                       backgroundColor:'#d7d9d0',
                       chartArea:{height: 225},
                       titleTextStyle:{ 
                                      fontSize: 18,
                                      bold: true
                                       }
                       };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
      }

    // $scope.mdata = {}
    // $scope.mdata.dataset1 = $scope.work
    // console.log(" work ",$scope.work);

    //  $scope.data = {
    //     dataset0: [
    //       {x: 0, val_0: 0, val_1: 0, val_2: 0, val_3: 0},
    //       {x: 1, val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
    //       {x: 2, val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
    //       {x: 3, val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
    //       {x: 4, val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
    //       {x: 5, val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
    //       {x: 6, val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
    //       {x: 7, val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625}
    //     ]
    //   };

    // $scope.options = {
    //   series: [
    //     {
    //       axis: "y",
    //       dataset: "dataset0",
    //       key: "val_1",
    //       label: "An area series",
    //       color: "#1f77b4",
    //       type: ['line', 'dot', 'area'],
    //       id: 'mySeries0'
    //     }
    //   ],
    //   axes: {x: {key: "x"}}
    // };

    // $scope.moptions = {
    //     series: [
    //     {
    //       axis: "y",
    //       dataset: "dataset1",
    //       key: "span",
    //       label: "An area series",
    //       color: "#1f77b4",
    //       type: ['line', 'dot', 'area'],
    //       id: 'mySeries1'
    //     }
    //   ],
    //   axes: {x: {key: "time"}}
    // }

    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });
}])

