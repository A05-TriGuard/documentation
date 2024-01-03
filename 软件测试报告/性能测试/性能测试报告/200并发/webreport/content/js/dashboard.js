/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8218125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.915, 500, 1500, "获取食物信息历史"], "isController": false}, {"data": [0.725, 500, 1500, "按日期范围查询血脂"], "isController": false}, {"data": [0.9125, 500, 1500, "按日期查询血脂"], "isController": false}, {"data": [0.7175, 500, 1500, "获取动态列表"], "isController": false}, {"data": [0.725, 500, 1500, "获取疾病预防文章列表"], "isController": false}, {"data": [0.7025, 500, 1500, "获取步数信息"], "isController": false}, {"data": [0.72, 500, 1500, "获取文章内容"], "isController": false}, {"data": [0.9125, 500, 1500, "按日期查询血压"], "isController": false}, {"data": [0.7275, 500, 1500, "按条件查询血糖"], "isController": false}, {"data": [0.925, 500, 1500, "获取食物记录"], "isController": false}, {"data": [0.735, 500, 1500, "按日期范围查询血压"], "isController": false}, {"data": [0.8275, 500, 1500, "获取登录用户信息"], "isController": false}, {"data": [0.9275, 500, 1500, "获取药品收藏列表"], "isController": false}, {"data": [0.9075, 500, 1500, "获取疾病预防文章收藏列表"], "isController": false}, {"data": [0.8925, 500, 1500, "获取运动记录"], "isController": false}, {"data": [0.93, 500, 1500, "获取药品信息"], "isController": false}, {"data": [0.9025, 500, 1500, "获取被监护人邀请列表"], "isController": false}, {"data": [0.7125, 500, 1500, "获取被监护人列表"], "isController": false}, {"data": [0.7225, 500, 1500, "按日期查询血糖"], "isController": false}, {"data": [0.905, 500, 1500, "获取监护人列表"], "isController": false}, {"data": [0.9075, 500, 1500, "获取动态评论列表"], "isController": false}, {"data": [0.695, 500, 1500, "搜索食物"], "isController": false}, {"data": [0.905, 500, 1500, "按条件查询血压"], "isController": false}, {"data": [0.7925, 500, 1500, "获取饮食目标"], "isController": false}, {"data": [0.72, 500, 1500, "获取被监护人今日活动信息"], "isController": false}, {"data": [0.9025, 500, 1500, "获取监护组活动信息"], "isController": false}, {"data": [0.9175, 500, 1500, "搜索药品"], "isController": false}, {"data": [0.7325, 500, 1500, "获取当前记录"], "isController": false}, {"data": [0.9125, 500, 1500, "按条件查询血脂"], "isController": false}, {"data": [0.7025, 500, 1500, "搜索药品历史"], "isController": false}, {"data": [0.92, 500, 1500, "搜索食物历史"], "isController": false}, {"data": [0.695, 500, 1500, "获取食物信息"], "isController": false}, {"data": [0.91, 500, 1500, "获取科普文章列表"], "isController": false}, {"data": [0.9725, 500, 1500, "获取身体指标"], "isController": false}, {"data": [0.725, 500, 1500, "获取食物收藏列表"], "isController": false}, {"data": [0.9175, 500, 1500, "获取今日运动时长"], "isController": false}, {"data": [0.91, 500, 1500, "按日期范围查询血糖"], "isController": false}, {"data": [0.73, 500, 1500, "获取科普文章收藏列表"], "isController": false}, {"data": [0.6925, 500, 1500, "获取药品信息历史"], "isController": false}, {"data": [0.7675, 500, 1500, "获取步数和运动时长"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8000, 0, 0.0, 390.0473750000001, 4, 905, 387.0, 711.0, 753.0, 807.0, 487.9834085641088, 339.692327413993, 224.20311928144446], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["获取食物信息历史", 200, 0, 0.0, 301.1450000000002, 5, 779, 260.0, 688.8, 729.8999999999997, 770.97, 43.04778303917348, 22.856102695867413, 18.87544393026259], "isController": false}, {"data": ["按日期范围查询血脂", 200, 0, 0.0, 484.85, 6, 817, 526.5, 732.0, 748.95, 811.97, 24.826216484607745, 12.437352594339623, 12.170664721946377], "isController": false}, {"data": ["按日期查询血脂", 200, 0, 0.0, 304.32500000000016, 5, 905, 261.5, 692.3000000000001, 717.8, 803.9300000000001, 24.953212726138492, 12.500974734872115, 11.501871490954459], "isController": false}, {"data": ["获取动态列表", 200, 0, 0.0, 486.425, 11, 892, 531.0, 752.5, 789.5999999999999, 817.8900000000001, 38.85003885003885, 42.530169483294486, 20.828780594405597], "isController": false}, {"data": ["获取疾病预防文章列表", 200, 0, 0.0, 489.235, 6, 826, 521.0, 732.7, 770.75, 808.97, 22.880677268047137, 26.075928097471685, 10.43484012126759], "isController": false}, {"data": ["获取步数信息", 200, 0, 0.0, 505.8649999999998, 6, 894, 551.5, 777.4000000000001, 828.6999999999999, 881.96, 45.44421722335833, 41.22820097705067, 21.47949329697796], "isController": false}, {"data": ["获取文章内容", 200, 0, 0.0, 484.215, 5, 897, 527.5, 743.8, 760.95, 813.0, 24.295432458697768, 15.493083394071915, 10.629251700680273], "isController": false}, {"data": ["按日期查询血压", 200, 0, 0.0, 298.38999999999993, 6, 796, 254.5, 678.0, 727.8, 792.8500000000001, 36.96174459434486, 25.1946266863796, 17.54239050083164], "isController": false}, {"data": ["按条件查询血糖", 200, 0, 0.0, 486.31500000000005, 6, 810, 525.0, 730.9, 754.95, 800.9000000000001, 27.855153203342617, 17.73589832869081, 14.036385793871867], "isController": false}, {"data": ["获取食物记录", 200, 0, 0.0, 277.875, 4, 770, 248.5, 590.9, 679.5999999999999, 714.94, 77.33952049497293, 46.751135924207276, 36.55500773395205], "isController": false}, {"data": ["按日期范围查询血压", 200, 0, 0.0, 480.44499999999994, 5, 794, 513.5, 721.9, 753.9, 774.96, 36.48303538854432, 45.069374771981025, 17.95649398029916], "isController": false}, {"data": ["获取登录用户信息", 200, 0, 0.0, 380.985, 13, 829, 329.0, 688.3000000000001, 738.9, 818.9000000000001, 140.25245441795232, 84.78151297335204, 60.812587657784015], "isController": false}, {"data": ["获取药品收藏列表", 200, 0, 0.0, 284.7699999999999, 9, 836, 246.5, 616.3000000000001, 733.8, 798.8600000000001, 56.85048322910745, 30.201819215463335, 25.260712762933487], "isController": false}, {"data": ["获取疾病预防文章收藏列表", 200, 0, 0.0, 316.39, 7, 820, 273.0, 700.6, 744.9, 805.9300000000001, 24.369440721335444, 16.587402522237113, 11.327982210308273], "isController": false}, {"data": ["获取运动记录", 200, 0, 0.0, 327.44999999999993, 6, 856, 292.0, 693.2, 755.4499999999998, 851.8100000000002, 46.68534080298786, 29.132746848739497, 22.430847338935575], "isController": false}, {"data": ["获取药品信息", 200, 0, 0.0, 282.8350000000001, 9, 802, 252.0, 591.3000000000001, 726.4499999999998, 798.8900000000001, 74.07407407407408, 49.69618055555555, 32.55208333333333], "isController": false}, {"data": ["获取被监护人邀请列表", 200, 0, 0.0, 314.61499999999995, 4, 804, 269.5, 722.7, 751.95, 801.8400000000001, 30.016509079993998, 17.41192030616839, 13.2494747110911], "isController": false}, {"data": ["获取被监护人列表", 200, 0, 0.0, 490.5749999999997, 14, 802, 534.0, 749.6, 777.8, 796.98, 29.832935560859188, 19.89833494928401, 12.847973224940334], "isController": false}, {"data": ["按日期查询血糖", 200, 0, 0.0, 486.7450000000001, 6, 815, 524.5, 727.9, 754.95, 803.7000000000003, 31.575623618566468, 20.382311730344174, 14.523553441742976], "isController": false}, {"data": ["获取监护人列表", 200, 0, 0.0, 314.86, 9, 900, 267.0, 712.7, 751.8, 857.4300000000005, 26.892564205997044, 16.25634496436735, 11.686710030926449], "isController": false}, {"data": ["获取动态评论列表", 200, 0, 0.0, 306.42, 4, 829, 263.0, 703.5, 738.95, 815.6400000000003, 39.37007874015748, 19.723486712598426, 17.76267224409449], "isController": false}, {"data": ["搜索食物", 200, 0, 0.0, 521.0100000000002, 10, 832, 553.0, 748.9, 774.95, 829.96, 63.071586250394205, 41.452321822768845, 28.948872595395777], "isController": false}, {"data": ["按条件查询血压", 200, 0, 0.0, 308.27499999999986, 6, 795, 266.0, 696.9, 725.0, 784.94, 32.17503217503218, 62.087757400257395, 16.433146315958815], "isController": false}, {"data": ["获取饮食目标", 200, 0, 0.0, 427.9800000000003, 4, 749, 471.0, 657.6, 694.95, 740.9000000000001, 102.19724067450178, 63.27446346448646, 44.41188681655595], "isController": false}, {"data": ["获取被监护人今日活动信息", 200, 0, 0.0, 484.72000000000014, 8, 805, 532.5, 755.5, 781.8, 800.98, 33.67003367003367, 20.484795875420875, 14.927925084175083], "isController": false}, {"data": ["获取监护组活动信息", 200, 0, 0.0, 314.16999999999996, 5, 833, 271.0, 713.8, 745.8499999999999, 813.9300000000001, 34.002040122407344, 18.030378697721865, 15.340764195851753], "isController": false}, {"data": ["搜索药品", 200, 0, 0.0, 269.1250000000001, 12, 835, 189.0, 660.5, 745.55, 826.9000000000001, 100.150225338007, 53.20480721081622, 46.3586004006009], "isController": false}, {"data": ["获取当前记录", 200, 0, 0.0, 487.58000000000015, 4, 889, 550.0, 751.6, 804.8, 874.8800000000001, 55.49389567147614, 27.909527608213097, 24.65793215871254], "isController": false}, {"data": ["按条件查询血脂", 200, 0, 0.0, 299.9500000000001, 6, 816, 253.0, 687.6, 737.9, 813.8300000000002, 22.862368541380885, 21.076245999085508, 11.230245484682214], "isController": false}, {"data": ["搜索药品历史", 200, 0, 0.0, 518.8500000000001, 8, 811, 546.5, 749.2, 776.8499999999999, 800.9100000000001, 73.09941520467837, 37.11223044590643, 32.48069718567251], "isController": false}, {"data": ["搜索食物历史", 200, 0, 0.0, 296.49, 7, 820, 253.0, 686.9000000000001, 738.95, 813.7200000000003, 51.493305870236874, 26.213311019567456, 22.67918061277034], "isController": false}, {"data": ["获取食物信息", 200, 0, 0.0, 518.2400000000001, 17, 838, 555.5, 739.7, 770.4999999999999, 831.8800000000001, 50.955414012738856, 33.53901273885351, 22.19347133757962], "isController": false}, {"data": ["获取科普文章列表", 200, 0, 0.0, 309.8999999999999, 5, 856, 267.5, 706.4000000000001, 732.75, 807.99, 22.484541877459247, 22.83586284429455, 10.232223159078135], "isController": false}, {"data": ["获取身体指标", 200, 0, 0.0, 219.245, 4, 721, 196.0, 422.70000000000005, 612.2999999999994, 668.0, 108.28370330265295, 62.284278559826745, 47.162628586897675], "isController": false}, {"data": ["获取食物收藏列表", 200, 0, 0.0, 481.4149999999999, 6, 787, 523.0, 724.4000000000001, 741.95, 782.9300000000001, 42.78990158322636, 24.111106653829694, 18.84594298245614], "isController": false}, {"data": ["获取今日运动时长", 200, 0, 0.0, 288.40999999999997, 4, 867, 253.5, 655.7, 702.0999999999998, 816.7700000000002, 57.47126436781609, 28.735632183908045, 25.592672413793103], "isController": false}, {"data": ["按日期范围查询血糖", 200, 0, 0.0, 306.33499999999987, 6, 809, 263.0, 683.6, 726.5999999999999, 807.9300000000001, 28.268551236749115, 22.995803886925795, 13.830609540636042], "isController": false}, {"data": ["获取科普文章收藏列表", 200, 0, 0.0, 480.55500000000006, 6, 846, 520.5, 739.0, 769.8, 821.9100000000001, 26.788106080900082, 16.402482922582372, 12.452283686043396], "isController": false}, {"data": ["获取药品信息历史", 200, 0, 0.0, 520.7099999999999, 5, 831, 553.5, 746.9, 772.0, 827.6800000000003, 70.2247191011236, 37.30688202247191, 31.06620874297753], "isController": false}, {"data": ["获取步数和运动时长", 200, 0, 0.0, 444.205, 5, 767, 482.0, 694.8, 725.95, 758.8800000000001, 74.04664938911515, 50.183959644576085, 34.926300444279896], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
