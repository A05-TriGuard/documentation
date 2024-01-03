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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.986875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "获取食物信息历史"], "isController": false}, {"data": [1.0, 500, 1500, "按日期范围查询血脂"], "isController": false}, {"data": [1.0, 500, 1500, "按日期查询血脂"], "isController": false}, {"data": [1.0, 500, 1500, "获取动态列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取疾病预防文章列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取步数信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取文章内容"], "isController": false}, {"data": [1.0, 500, 1500, "按日期查询血压"], "isController": false}, {"data": [1.0, 500, 1500, "按条件查询血糖"], "isController": false}, {"data": [1.0, 500, 1500, "获取食物记录"], "isController": false}, {"data": [1.0, 500, 1500, "按日期范围查询血压"], "isController": false}, {"data": [0.5, 500, 1500, "获取登录用户信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取药品收藏列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取疾病预防文章收藏列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取运动记录"], "isController": false}, {"data": [0.985, 500, 1500, "获取药品信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取被监护人邀请列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取被监护人列表"], "isController": false}, {"data": [1.0, 500, 1500, "按日期查询血糖"], "isController": false}, {"data": [1.0, 500, 1500, "获取监护人列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取动态评论列表"], "isController": false}, {"data": [1.0, 500, 1500, "搜索食物"], "isController": false}, {"data": [1.0, 500, 1500, "按条件查询血压"], "isController": false}, {"data": [1.0, 500, 1500, "获取饮食目标"], "isController": false}, {"data": [1.0, 500, 1500, "获取被监护人今日活动信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取监护组活动信息"], "isController": false}, {"data": [1.0, 500, 1500, "搜索药品"], "isController": false}, {"data": [1.0, 500, 1500, "获取当前记录"], "isController": false}, {"data": [1.0, 500, 1500, "按条件查询血脂"], "isController": false}, {"data": [1.0, 500, 1500, "搜索药品历史"], "isController": false}, {"data": [1.0, 500, 1500, "搜索食物历史"], "isController": false}, {"data": [1.0, 500, 1500, "获取食物信息"], "isController": false}, {"data": [1.0, 500, 1500, "获取科普文章列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取身体指标"], "isController": false}, {"data": [1.0, 500, 1500, "获取食物收藏列表"], "isController": false}, {"data": [1.0, 500, 1500, "获取今日运动时长"], "isController": false}, {"data": [1.0, 500, 1500, "按日期范围查询血糖"], "isController": false}, {"data": [1.0, 500, 1500, "获取科普文章收藏列表"], "isController": false}, {"data": [0.99, 500, 1500, "获取药品信息历史"], "isController": false}, {"data": [1.0, 500, 1500, "获取步数和运动时长"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4000, 0, 0.0, 229.77775000000054, 4, 1251, 213.0, 396.9000000000001, 427.0, 1133.8899999999976, 408.62192256614566, 285.2756641702421, 187.74062404229238], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["获取食物信息历史", 100, 0, 0.0, 123.12, 5, 405, 109.0, 213.70000000000002, 390.79999999999995, 404.99, 48.332527791203475, 25.67665538907685, 21.19268064282262], "isController": false}, {"data": ["按日期范围查询血脂", 100, 0, 0.0, 275.29999999999984, 6, 430, 285.5, 368.8, 389.6499999999999, 429.90999999999997, 24.703557312252965, 12.375903223814229, 12.110532979249012], "isController": false}, {"data": ["按日期查询血脂", 100, 0, 0.0, 138.53000000000003, 9, 453, 120.0, 313.0000000000004, 416.79999999999995, 452.99, 25.839793281653744, 12.945130813953488, 11.910529715762273], "isController": false}, {"data": ["获取动态列表", 100, 0, 0.0, 284.0300000000001, 11, 453, 300.0, 407.70000000000005, 431.74999999999994, 452.92999999999995, 35.56187766714083, 38.9305320945946, 19.06588949146515], "isController": false}, {"data": ["获取疾病预防文章列表", 100, 0, 0.0, 290.9899999999999, 7, 443, 305.5, 394.9, 409.79999999999995, 442.7599999999999, 22.60397830018083, 25.76058855108499, 10.30865025994575], "isController": false}, {"data": ["获取步数信息", 100, 0, 0.0, 276.92, 5, 447, 285.0, 402.6, 420.6499999999999, 446.90999999999997, 41.52823920265781, 37.67552169850499, 19.62858181063123], "isController": false}, {"data": ["获取文章内容", 100, 0, 0.0, 283.46, 5, 456, 299.0, 388.8, 403.74999999999994, 455.6099999999998, 22.851919561243143, 14.57256198583181, 9.997714808043876], "isController": false}, {"data": ["按日期查询血压", 100, 0, 0.0, 130.72, 5, 417, 117.0, 219.70000000000002, 389.5999999999999, 416.77999999999986, 40.29008863819501, 27.463361200644638, 19.12205378726833], "isController": false}, {"data": ["按条件查询血糖", 100, 0, 0.0, 281.38999999999993, 5, 422, 290.0, 380.8, 393.84999999999997, 421.99, 27.777777777777775, 17.686631944444443, 13.997395833333332], "isController": false}, {"data": ["获取食物记录", 100, 0, 0.0, 118.28000000000004, 4, 375, 109.0, 224.50000000000009, 323.44999999999965, 374.76999999999987, 77.82101167315176, 47.04219357976654, 36.78258754863813], "isController": false}, {"data": ["按日期范围查询血压", 100, 0, 0.0, 285.03000000000014, 6, 430, 292.0, 377.8, 389.95, 429.86999999999995, 36.231884057971016, 44.759114583333336, 17.83288043478261], "isController": false}, {"data": ["获取登录用户信息", 100, 0, 0.0, 989.0600000000001, 535, 1251, 1028.0, 1248.9, 1250.0, 1250.99, 79.93605115907273, 48.3207184252598, 34.6597721822542], "isController": false}, {"data": ["获取药品收藏列表", 100, 0, 0.0, 120.34000000000003, 5, 405, 108.5, 224.60000000000002, 268.4999999999999, 404.96, 70.47216349541931, 37.438336856941504, 31.313314834390415], "isController": false}, {"data": ["获取疾病预防文章收藏列表", 100, 0, 0.0, 137.43999999999997, 12, 411, 122.5, 261.00000000000017, 385.7999999999997, 410.92999999999995, 24.324981756263682, 16.557140902456823, 11.307315738263197], "isController": false}, {"data": ["获取运动记录", 100, 0, 0.0, 135.62, 4, 399, 116.0, 330.4000000000001, 365.39999999999986, 398.8399999999999, 47.393364928909946, 29.574570497630333, 22.771030805687204], "isController": false}, {"data": ["获取药品信息", 100, 0, 0.0, 158.45999999999998, 12, 537, 137.5, 304.20000000000005, 452.4499999999985, 536.9499999999999, 113.89521640091115, 76.41212272209567, 50.05160876993166], "isController": false}, {"data": ["获取被监护人邀请列表", 100, 0, 0.0, 122.13999999999996, 4, 440, 111.5, 217.50000000000003, 352.94999999999976, 439.90999999999997, 30.138637733574445, 17.48276446654611, 13.303383062085594], "isController": false}, {"data": ["获取被监护人列表", 100, 0, 0.0, 279.2, 8, 415, 289.5, 383.8, 397.79999999999995, 414.91999999999996, 27.808676307007786, 18.548169841490544, 11.97619751112347], "isController": false}, {"data": ["按日期查询血糖", 100, 0, 0.0, 275.55, 5, 426, 287.5, 372.8, 394.4999999999999, 425.98, 31.71582619727244, 20.472813590231524, 14.588041151284491], "isController": false}, {"data": ["获取监护人列表", 100, 0, 0.0, 131.0, 9, 455, 116.0, 224.60000000000002, 377.79999999999995, 454.53999999999974, 26.867275658248253, 16.241058234819988, 11.675720378828586], "isController": false}, {"data": ["获取动态评论列表", 100, 0, 0.0, 145.3, 4, 449, 152.0, 289.5000000000001, 368.9999999999998, 448.6899999999998, 39.52569169960474, 19.80144515810277, 17.83288043478261], "isController": false}, {"data": ["搜索食物", 100, 0, 0.0, 302.9799999999999, 9, 412, 309.5, 394.8, 400.0, 411.96, 65.65988181221275, 43.15341841759685, 30.136859816152334], "isController": false}, {"data": ["按条件查询血压", 100, 0, 0.0, 133.20000000000002, 10, 434, 116.5, 218.40000000000003, 397.9, 433.81999999999994, 33.97893306150187, 65.56872239211688, 17.354474600747537], "isController": false}, {"data": ["获取饮食目标", 100, 0, 0.0, 230.51, 4, 371, 250.5, 340.6, 349.0, 370.92999999999995, 85.68980291345329, 53.054038131962294, 37.23824443016281], "isController": false}, {"data": ["获取被监护人今日活动信息", 100, 0, 0.0, 276.45, 8, 413, 294.0, 389.6, 398.9, 412.93999999999994, 31.28911138923655, 19.036246479974967, 13.872320869837296], "isController": false}, {"data": ["获取监护组活动信息", 100, 0, 0.0, 132.72999999999996, 6, 418, 119.0, 260.20000000000016, 363.84999999999997, 417.71999999999986, 34.118048447628794, 18.09189483111566, 15.393103889457523], "isController": false}, {"data": ["搜索药品", 100, 0, 0.0, 427.82999999999987, 416, 443, 427.0, 439.0, 441.0, 442.99, 225.22522522522522, 119.6509009009009, 104.25464527027027], "isController": false}, {"data": ["获取当前记录", 100, 0, 0.0, 245.60999999999993, 4, 385, 265.5, 356.9, 366.0, 384.92999999999995, 50.0, 25.146484375, 22.216796875], "isController": false}, {"data": ["按条件查询血脂", 100, 0, 0.0, 134.04999999999998, 9, 413, 117.0, 244.60000000000014, 400.9, 412.99, 23.457658925639223, 21.625029322073658, 11.522658632418485], "isController": false}, {"data": ["搜索药品历史", 100, 0, 0.0, 222.25, 19, 438, 151.0, 411.70000000000005, 425.9, 437.95, 224.7191011235955, 132.32970505617976, 99.8507724719101], "isController": false}, {"data": ["搜索食物历史", 100, 0, 0.0, 116.25, 4, 405, 103.5, 204.70000000000002, 379.29999999999825, 404.96999999999997, 59.347181008902076, 30.18650315281899, 26.138260385756677], "isController": false}, {"data": ["获取食物信息", 100, 0, 0.0, 296.5899999999998, 11, 406, 303.0, 385.8, 394.9, 406.0, 51.124744376278116, 33.650466513292436, 22.267222648261757], "isController": false}, {"data": ["获取科普文章列表", 100, 0, 0.0, 137.55, 7, 425, 121.0, 264.8000000000001, 406.1499999999998, 424.92999999999995, 22.39140170174653, 22.74126735333632, 10.18983710255262], "isController": false}, {"data": ["获取身体指标", 100, 0, 0.0, 106.38000000000007, 5, 317, 99.5, 190.60000000000002, 267.79999999999995, 316.93999999999994, 111.1111111111111, 63.91059027777778, 48.39409722222222], "isController": false}, {"data": ["获取食物收藏列表", 100, 0, 0.0, 284.85999999999984, 6, 406, 294.0, 380.9, 392.79999999999995, 405.9, 42.75331338178709, 24.090490059854638, 18.829828452330055], "isController": false}, {"data": ["获取今日运动时长", 100, 0, 0.0, 128.14000000000001, 5, 393, 116.5, 251.50000000000003, 329.74999999999994, 392.88999999999993, 60.06006006006006, 30.03003003003003, 26.745495495495494], "isController": false}, {"data": ["按日期范围查询血糖", 100, 0, 0.0, 136.64000000000001, 10, 420, 118.5, 311.2000000000004, 387.79999999999995, 419.99, 29.420417769932335, 23.93282031479847, 14.394169240953222], "isController": false}, {"data": ["获取科普文章收藏列表", 100, 0, 0.0, 294.3000000000001, 7, 426, 306.5, 395.9, 404.95, 425.88999999999993, 25.062656641604008, 15.345982142857142, 11.650219298245613], "isController": false}, {"data": ["获取药品信息历史", 100, 0, 0.0, 357.01, 204, 509, 365.5, 460.6, 488.69999999999993, 508.96, 79.4912559618442, 42.229729729729726, 35.165565381558025], "isController": false}, {"data": ["获取步数和运动时长", 100, 0, 0.0, 245.8999999999999, 5, 390, 266.0, 366.70000000000005, 374.9, 389.90999999999997, 64.43298969072164, 43.66845199742268, 30.39173244201031], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
