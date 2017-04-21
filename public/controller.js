

console.log('inside controller out')
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
        console.log('first ');

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
    $scope.showChart = true;
    $scope.message = 'Loading...';

    LogsFactory.query(
    function (response) {
        $scope.logs = response;     
        console.log('logs ',$scope.logs);

        $scope.work = $scope.logs.filter(function(log){
        return log.activity.type == "work";
        
    });
        console.log('work ',$scope.work);
    $scope.entertainment = $scope.logs.filter(function(log){
        return log.activity.type == "entertainment";
        
    });
    console.log('enter ',$scope.entertainment);
    $scope.study = $scope.logs.filter(function(log){
        return log.activity.type == "study";
        
    });
    console.log('study ',$scope.study);


    var workRows = $scope.work.map(function(elem){
        var temp = [new Date(elem.time) , (elem.span || 0) / (1000*60)];
        console.log('temp1 ',temp);
        return temp;
    })

    var entertainmentRows = $scope.entertainment.map(function(elem){
        var temp = [new Date(elem.time) , (elem.span || 0) / (1000*60)];
        console.log('temp2 ',temp);
        return temp;
    })

    var studyRows = $scope.study.map(function(elem){
        var temp = [new Date(elem.time) , (elem.span || 0) / (1000*60)];
        console.log('temp3 ',temp);
        return temp;
    })

     google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(function(){
        $scope.showChart = true;
        drawChart1()
        drawChart2()
        drawChart3()
      });
      // google.charts.setOnLoadCallback(drawChart1);
      // google.charts.setOnLoadCallback(drawChart2);
      // google.charts.setOnLoadCallback(drawChart3);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      var options = {'title':'Work',
                       curveType: 'none',
                       legend: { position: 'in',
                                alignment:'center' },
                       fontSize:14,
                       backgroundColor:'#d7d9d0',
                       chartArea:{height: 225},
                       titleTextStyle:{ 
                                      fontSize: 21,
                                      bold: true
                                       },
                        pointSize:5
                       };

      

      function drawChart1() {
        var data1 = new google.visualization.DataTable();
        data1.addColumn('date', 'time');
        data1.addColumn('number', 'time spent (min)');
        data1.addRows(workRows);
        var formatter1 = new google.visualization.DateFormat({formatType: 'medium'});
        formatter1.format(data1,1);
         var options = {'title':'Work',
                       curveType: 'none',
                       legend: { position: 'in',
                                alignment:'center' },
                       fontSize:14,
                       backgroundColor:'#d7d9d0',
                       chartArea:{height: 225},
                       titleTextStyle:{ 
                                      fontSize: 21,
                                      bold: true
                                       },
                        pointSize:5
                       };
        var chart1 = new google.visualization.LineChart(document.getElementById('curve_chart1'));
        
        chart1.draw(data1, options);
      }

      function drawChart2() {
        var data2 = new google.visualization.DataTable();
        data2.addColumn('date', 'time');
        data2.addColumn('number', 'time spent (min)');
        data2.addRows(entertainmentRows);
        var formatter2 = new google.visualization.DateFormat({formatType: 'medium'});
        formatter2.format(data2,1);
         var options = {'title':'Entertainment',
                       curveType: 'none',
                       legend: { position: 'in',
                                alignment:'center' },
                       fontSize:14,
                       backgroundColor:'#d7d9d0',
                       chartArea:{height: 225},
                       titleTextStyle:{ 
                                      fontSize: 21,
                                      bold: true
                                       },
                        pointSize:5
                       };
        var chart2 = new google.visualization.LineChart(document.getElementById('curve_chart2'));
        chart2.draw(data2, options);
      }

      function drawChart3() {
        var data3 = new google.visualization.DataTable();
        data3.addColumn('date', 'time');
        data3.addColumn('number', 'time spent (min)');
        data3.addRows(studyRows);
        var formatter3 = new google.visualization.DateFormat({formatType: 'medium'});
        formatter3.format(data3,1);
         var options = {'title':'Study',
                       curveType: 'none',
                       legend: { position: 'in',
                                alignment:'center' },
                       fontSize:14,
                       backgroundColor:'#d7d9d0',
                       chartArea:{height: 225},
                       titleTextStyle:{ 
                                      fontSize: 21,
                                      bold: true
                                       },
                        pointSize:5
                       };
        var chart3 = new google.visualization.LineChart(document.getElementById('curve_chart3'));
        chart3.draw(data3, options);
      }

    

    },
    function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });
}])
