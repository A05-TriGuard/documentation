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

    var data = {"OkPercent": 99.565, "KoPercent": 0.435};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.63225, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.614, 500, 1500, "获取食物信息历史"], "isController": false}, {"data": [0.611, 500, 1500, "按日期范围查询血脂"], "isController": false}, {"data": [0.615, 500, 1500, "按日期查询血脂"], "isController": false}, {"data": [0.576, 500, 1500, "获取动态列表"], "isController": false}, {"data": [0.613, 500, 1500, "获取疾病预防文章列表"], "isController": false}, {"data": [0.671, 500, 1500, "获取步数信息"], "isController": false}, {"data": [0.612, 500, 1500, "获取文章内容"], "isController": false}, {"data": [0.619, 500, 1500, "按日期查询血压"], "isController": false}, {"data": [0.603, 500, 1500, "按条件查询血糖"], "isController": false}, {"data": [0.707, 500, 1500, "获取食物记录"], "isController": false}, {"data": [0.603, 500, 1500, "按日期范围查询血压"], "isController": false}, {"data": [0.614, 500, 1500, "获取登录用户信息"], "isController": false}, {"data": [0.632, 500, 1500, "获取药品收藏列表"], "isController": false}, {"data": [0.634, 500, 1500, "获取疾病预防文章收藏列表"], "isController": false}, {"data": [0.701, 500, 1500, "获取运动记录"], "isController": false}, {"data": [0.621, 500, 1500, "获取药品信息"], "isController": false}, {"data": [0.644, 500, 1500, "获取被监护人邀请列表"], "isController": false}, {"data": [0.615, 500, 1500, "获取被监护人列表"], "isController": false}, {"data": [0.603, 500, 1500, "按日期查询血糖"], "isController": false}, {"data": [0.639, 500, 1500, "获取监护人列表"], "isController": false}, {"data": [0.648, 500, 1500, "获取动态评论列表"], "isController": false}, {"data": [0.606, 500, 1500, "搜索食物"], "isController": false}, {"data": [0.626, 500, 1500, "按条件查询血压"], "isController": false}, {"data": [0.674, 500, 1500, "获取饮食目标"], "isController": false}, {"data": [0.643, 500, 1500, "获取被监护人今日活动信息"], "isController": false}, {"data": [0.651, 500, 1500, "获取监护组活动信息"], "isController": false}, {"data": [0.635, 500, 1500, "搜索药品"], "isController": false}, {"data": [0.669, 500, 1500, "获取当前记录"], "isController": false}, {"data": [0.627, 500, 1500, "按条件查询血脂"], "isController": false}, {"data": [0.527, 500, 1500, "搜索药品历史"], "isController": false}, {"data": [0.636, 500, 1500, "搜索食物历史"], "isController": false}, {"data": [0.604, 500, 1500, "获取食物信息"], "isController": false}, {"data": [0.628, 500, 1500, "获取科普文章列表"], "isController": false}, {"data": [0.764, 500, 1500, "获取身体指标"], "isController": false}, {"data": [0.594, 500, 1500, "获取食物收藏列表"], "isController": false}, {"data": [0.7, 500, 1500, "获取今日运动时长"], "isController": false}, {"data": [0.618, 500, 1500, "按日期范围查询血糖"], "isController": false}, {"data": [0.613, 500, 1500, "获取科普文章收藏列表"], "isController": false}, {"data": [0.602, 500, 1500, "获取药品信息历史"], "isController": false}, {"data": [0.678, 500, 1500, "获取步数和运动时长"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20000, 87, 0.435, 734.4858000000012, 4, 1398, 717.5, 1132.0, 1187.0, 1260.0, 594.6187007581389, 418.9842182157723, 272.07498699271594], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["获取食物信息历史", 500, 0, 0.0, 789.4640000000002, 434, 1332, 780.0, 1192.8000000000002, 1219.95, 1258.96, 54.89679402722881, 29.163921826965304, 24.070957537329818], "isController": false}, {"data": ["按日期范围查询血脂", 500, 0, 0.0, 806.36, 427, 1233, 785.5, 1163.0, 1192.0, 1226.99, 31.255860473838847, 15.658453538163405, 15.32269722447959], "isController": false}, {"data": ["按日期查询血脂", 500, 0, 0.0, 819.9780000000003, 152, 1323, 851.0, 1173.9, 1203.9, 1235.99, 32.673332026400054, 16.368573564007058, 15.060363980918773], "isController": false}, {"data": ["获取动态列表", 500, 0, 0.0, 704.8239999999998, 43, 1201, 663.0, 1099.7, 1131.95, 1182.0, 25.067682743407197, 27.44225815953073, 13.439607252080616], "isController": false}, {"data": ["获取疾病预防文章列表", 500, 0, 0.0, 782.5580000000006, 421, 1262, 745.0, 1148.7, 1196.9, 1242.96, 28.617216117216117, 32.61356563358516, 13.051015553456958], "isController": false}, {"data": ["获取步数信息", 500, 0, 0.0, 650.1439999999996, 5, 1139, 640.0, 1034.8000000000002, 1068.85, 1113.0, 26.156099602427286, 23.729508330717724, 12.362843952709772], "isController": false}, {"data": ["获取文章内容", 500, 0, 0.0, 774.3839999999996, 408, 1245, 746.5, 1129.9, 1150.95, 1194.9, 26.622650551088867, 16.977139462754913, 11.64740961610138], "isController": false}, {"data": ["按日期查询血压", 500, 0, 0.0, 799.3199999999995, 425, 1376, 804.5, 1229.7, 1299.8, 1363.97, 46.455449224194, 31.665921443835362, 22.048191721638947], "isController": false}, {"data": ["按条件查询血糖", 500, 0, 0.0, 829.9740000000004, 423, 1292, 799.0, 1209.9, 1234.9, 1275.96, 34.41156228492773, 21.91048692360633, 17.34020130763937], "isController": false}, {"data": ["获取食物记录", 500, 0, 0.0, 601.9139999999991, 5, 1190, 587.5, 966.0, 1014.4999999999999, 1089.91, 28.993911278631487, 17.526592853000867, 13.704153377790663], "isController": false}, {"data": ["按日期范围查询血压", 500, 0, 0.0, 808.1120000000006, 425, 1386, 783.5, 1189.0, 1240.8, 1321.92, 43.459365493263796, 53.68759506736201, 21.390156453715775], "isController": false}, {"data": ["获取登录用户信息", 500, 87, 17.4, 537.4960000000004, 50, 1361, 427.5, 1052.6000000000001, 1181.4499999999996, 1341.95, 260.01040041601664, 246.02316123894954, 93.12231864274571], "isController": false}, {"data": ["获取药品收藏列表", 500, 0, 0.0, 767.6959999999993, 422, 1265, 770.5, 1165.8000000000002, 1200.0, 1236.95, 84.06186953597849, 44.657868190988566, 37.35170960827168], "isController": false}, {"data": ["获取疾病预防文章收藏列表", 500, 0, 0.0, 765.1040000000003, 415, 1221, 773.5, 1117.9, 1142.95, 1195.97, 25.658131061733464, 17.46456772463694, 11.927021860727665], "isController": false}, {"data": ["获取运动记录", 500, 0, 0.0, 625.5319999999997, 7, 1171, 620.0, 960.0, 1028.6999999999998, 1149.95, 26.557603441865403, 16.57256699155468, 12.760098528708768], "isController": false}, {"data": ["获取药品信息", 500, 0, 0.0, 767.3500000000005, 431, 1249, 754.5, 1181.2000000000003, 1214.95, 1239.99, 110.61946902654867, 74.21442892699116, 48.612071349557525], "isController": false}, {"data": ["获取被监护人邀请列表", 500, 0, 0.0, 723.3260000000001, 8, 1255, 717.5, 1065.8000000000002, 1122.35, 1174.96, 24.196670538133954, 14.035959277003483, 10.68056160472319], "isController": false}, {"data": ["获取被监护人列表", 500, 0, 0.0, 759.664000000001, 417, 1210, 718.5, 1120.0, 1143.0, 1172.97, 23.83222116301239, 15.89590532650143, 10.263681184461392], "isController": false}, {"data": ["按日期查询血糖", 500, 0, 0.0, 802.8399999999995, 367, 1305, 777.0, 1172.0, 1197.0, 1221.0, 38.36415253587049, 24.764360181846083, 17.64601156679199], "isController": false}, {"data": ["获取监护人列表", 500, 0, 0.0, 756.6679999999991, 410, 1236, 766.0, 1115.8000000000002, 1155.0, 1188.91, 23.931460297707368, 14.466380785430527, 10.399902180156033], "isController": false}, {"data": ["获取动态评论列表", 500, 0, 0.0, 677.1379999999995, 12, 1189, 665.0, 1027.9, 1067.9, 1173.95, 25.47640884540915, 12.76308372821767, 11.49423914704983], "isController": false}, {"data": ["搜索食物", 500, 0, 0.0, 797.838, 55, 1308, 770.5, 1183.7, 1244.95, 1292.98, 73.71369600471768, 48.44659903435058, 33.83343468966534], "isController": false}, {"data": ["按条件查询血压", 500, 0, 0.0, 771.1500000000001, 419, 1366, 772.0, 1180.0, 1217.0, 1269.93, 40.74979625101874, 78.63437245313774, 20.812640077424614], "isController": false}, {"data": ["获取饮食目标", 500, 0, 0.0, 616.5160000000005, 5, 1141, 625.0, 1020.9000000000001, 1066.9, 1107.97, 29.754820280885504, 18.42241802547013, 12.930561547845752], "isController": false}, {"data": ["获取被监护人今日活动信息", 500, 0, 0.0, 704.8039999999995, 104, 1197, 664.0, 1082.8000000000002, 1119.95, 1156.99, 24.50740123517302, 14.910264618664836, 10.86558609450054], "isController": false}, {"data": ["获取监护组活动信息", 500, 0, 0.0, 696.6000000000001, 14, 1170, 697.5, 1045.0, 1115.85, 1152.99, 24.847189782835564, 13.17580473835909, 11.210353202802763], "isController": false}, {"data": ["搜索药品", 500, 0, 0.0, 709.9160000000002, 145, 1359, 640.0, 1175.0, 1217.95, 1282.97, 173.19016279875305, 92.00727398683755, 80.16810270176654], "isController": false}, {"data": ["获取当前记录", 500, 0, 0.0, 630.4980000000003, 5, 1143, 617.5, 1017.9000000000001, 1058.95, 1109.96, 27.194604590449256, 13.676973988360709, 12.083540125639074], "isController": false}, {"data": ["按条件查询血脂", 500, 0, 0.0, 777.8279999999993, 424, 1259, 780.5, 1149.9, 1199.0, 1239.95, 29.843619434164978, 27.512086665870836, 14.659512280649396], "isController": false}, {"data": ["搜索药品历史", 500, 0, 0.0, 837.7019999999995, 431, 1334, 817.5, 1182.0, 1213.95, 1300.92, 127.03252032520327, 64.4799209222561, 56.44511401168699], "isController": false}, {"data": ["搜索食物历史", 500, 0, 0.0, 763.1340000000008, 418, 1328, 748.5, 1216.7, 1266.85, 1316.95, 66.20762711864407, 33.629983158434854, 29.159804521980934], "isController": false}, {"data": ["获取食物信息", 500, 0, 0.0, 801.9499999999999, 425, 1317, 764.5, 1190.9, 1217.95, 1266.97, 60.20469596628537, 39.62691902468393, 26.2219671884407], "isController": false}, {"data": ["获取科普文章列表", 500, 0, 0.0, 769.9540000000003, 424, 1253, 772.0, 1136.6000000000001, 1199.95, 1244.96, 27.584684982897492, 28.015695685755265, 12.553186720732649], "isController": false}, {"data": ["获取身体指标", 500, 0, 0.0, 514.9919999999995, 4, 1173, 448.5, 944.0, 989.95, 1035.92, 30.526894193784724, 17.55892644544844, 13.29589336955858], "isController": false}, {"data": ["获取食物收藏列表", 500, 0, 0.0, 839.768000000001, 436, 1382, 819.5, 1208.6000000000001, 1236.0, 1342.97, 49.980007996801284, 28.162563099760096, 22.012679303278688], "isController": false}, {"data": ["获取今日运动时长", 500, 0, 0.0, 613.5880000000003, 5, 1182, 616.5, 964.9000000000001, 1019.8499999999999, 1166.2200000000007, 27.660986944014162, 13.830493472007081, 12.317783248506306], "isController": false}, {"data": ["按日期范围查询血糖", 500, 0, 0.0, 791.2180000000003, 423, 1398, 794.5, 1178.9, 1213.95, 1381.96, 36.205648081100655, 29.452446144098477, 17.713896180304125], "isController": false}, {"data": ["获取科普文章收藏列表", 500, 0, 0.0, 772.1880000000001, 417, 1230, 740.5, 1129.9, 1154.95, 1219.96, 24.754926230319832, 15.15755736954154, 11.507172739875235], "isController": false}, {"data": ["获取药品信息历史", 500, 0, 0.0, 800.4100000000005, 432, 1251, 779.0, 1151.6000000000001, 1176.9, 1215.95, 96.9743987587277, 51.48829185657487, 42.89980726338247], "isController": false}, {"data": ["获取步数和运动时长", 500, 0, 0.0, 619.5320000000002, 6, 1150, 612.0, 1020.9000000000001, 1060.85, 1098.96, 28.363966417063764, 19.223235052189697, 13.378706815861129], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 87, 100.0, 0.435], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20000, 87, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 87, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["获取登录用户信息", 500, 87, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 87, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
