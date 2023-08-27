```
dubbo-access-provider.log
```

```java
{
   "properties":{
         "bstatus":{"code":0}
         "t": "f_od_order_detail",
        "request": {
            "orderNo": "1321",
             "cid": "wx_app"
        },
        "response": {
            "orderInfo": ""
        }
    }
}
```

```
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page session="false" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@ page import="org.springframework.web.context.WebApplicationContext"%>
<%@ page import="com.qunar.flight.userproduct.haders.linker.caserobot.service.kfkprocessor.CaseRobotProcess" %>
<%@ page import="com.qunar.flight.userproduct.haders.linker.caserobot.service.kfkprocessor.OrderDetailKfkProcessor" %>
<%@ page import="com.qunar.flight.userproduct.haders.linker.caserobot.pojo.OrderInfo" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.response.OrderDetailResponse" %>
<%@ page import="javax.xml.crypto.Data" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.request.common.OrderDetailVO" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.response.orderinfo.module.OrderInfoModule" %>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.util.List" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.response.payinfo.Vendor4Detail" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.response.orderinfo.module.FlightInfoModule" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.vo.FlightSchedule" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.response.flightinfo.HeaderInfo" %>
<%@ page import="com.qunar.flight.postservice.athena.orderapi.detail.request.orderinfo.OrderDetailRequest" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<%
    WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(application);

    CaseRobotProcess caseRobotProcess = context.getBean(CaseRobotProcess.class);
    String s = "a\t[{\"properties\":{\"bstatus\":{\"code\":0},\"t\":\"f_od_order_detail\",\"request\":{\"orderNo\":\"1321\",\"cid\": \"wx_app\"},\"response\": {\"orderInfo\": \"a\"}}}]";
    caseRobotProcess.parser(s);

    OrderDetailKfkProcessor orderDetailKfkProcessor = context.getBean(OrderDetailKfkProcessor.class);
    OrderDetailResponse orderDetailResponse = new OrderDetailResponse();
    OrderDetailVO orderDetailVO = new OrderDetailVO();
    OrderInfoModule.SingleOrderInfo singleOrderInfo = new OrderInfoModule.SingleOrderInfo();
    singleOrderInfo.setOrderTime("2023-12-11 19:22:11");
    Vendor4Detail vendor4Detail = new Vendor4Detail();
    vendor4Detail.setOtaType(1);
    OrderInfoModule orderInfoModule = OrderInfoModule.builder().baseInfo(List.of(singleOrderInfo)).vendor(List.of(vendor4Detail)).build();
    orderDetailVO.setOrderInfo(orderInfoModule);
    FlightInfoModule flightInfoModule = new FlightInfoModule();
    FlightSchedule flightSchedule = new FlightSchedule();
    HeaderInfo headerInfo = new HeaderInfo();
    headerInfo.setDate("2023-12-11 19:22:11");
    flightSchedule.setHeaderInfo(headerInfo);
    flightSchedule.setOrderNo("xwp31221");
    flightInfoModule.setFlightInfo(List.of(flightSchedule));
    orderDetailVO.setFlightInfo(flightInfoModule);
    orderDetailResponse.setData(orderDetailVO);
    orderDetailKfkProcessor.processOrderInfo(new OrderInfo(orderDetailResponse, new OrderDetailRequest()));
%>
</body>
</html>
```

```json
$.data.orderInfo.orderStatus.orderStatuses[0].statusDesc 订单状态，如订单取消 / 待支付 / 出票完成 / 待出票
$.data.flightInfo.flightInfo[0].goInfos[0].arrAirport 出发机场
$.data.flightInfo.flightInfo[0].goInfos[0].depAirport 到达机场
$.data.flightInfo.flightInfo[0].goOptimizeInfo.collapeWeek 周几，如Wed
$.data.flightInfo.flightInfo[0].goOptimizeInfo.collapeTotalDuration 飞行时间，如?小时或者?小时?分钟
$.data.flightInfo.flightInfo[0].goInfos[0].depCity 出发城市
$.data.flightInfo.flightInfo[0].goInfos[0].arrCity 到达城市
$.data.flightInfo.flightInfo[0].goInfos[0].planeType 机型，如空客330(大)
$.data.flightInfo.flightInfo[0].goInfos[0].airlineName 航空
$.data.flightInfo.flightInfo[0].goOptimizeInfo.headDesc 航程描述，如直飞，去程，返程
$.data.flightInfo.flightInfo[0].goOverSeaTransNotice[0].transNoticeList[0].value 经停城市和时间，如台北 1小时

$.data.priceDetail.priceDetails[*].details[*].title 票类型，如成人票；票价；税费；marketReduce立减
$.data.priceDetail.priceDetails[*].details[*].desc x1人 x1份
```

```
(?<m1>[0-9]+)(?<v1>[\u4e00-\u9fa5]+) m1|v1 m1v1 v1=i18n_translate_map_flight_info

18小时45分钟 dynamic_modify (?<m1>[0-9]+)(?<v1>[^0-9]+)(?<m2>[0-9]+)(?<v2>[^0-9]+) m1|v1|m2|v2 ?v1?v2 ?v1?v2=i18n_translate_map_flight_info m1,m2
```

```
台北 1小时
(?<v1>[\u4e00-\u9fa5]+)(?<m1>[ ]+)(?<m2>[0-9]+)(?<v2>[\u4e00-\u9fa5]+)
v1|m1|m2|v2
v1m1m2v2
v1=i18n_translate_map_city,v2=i18n_translate_map_order_detail
v1,m2


台北 1小时06分
(?<v1>[\u4e00-\u9fa5]+)(?<m1>[ ]+)(?<m2>[0-9]+)(?<v2>[\u4e00-\u9fa5]+)(?<m3>[0-9]+)(?<v3>[\u4e00-\u9fa5]+)
v1|m1|m2|v2|m3|v3
v1m1m2v2m3v3
v1=i18n_translate_map_city,v2=i18n_translate_map_order_detail,v3=i18n_translate_map_order_detail
v1,m2,m3
```

往返

```json
$.data.flightInfo.flightInfo[0].backInfos[0].arrCity 返程的出发城市
$.data.flightInfo.flightInfo[0].backInfos[0].depCity 返程的到达城市
$.data.flightInfo.flightInfo[0].backInfos[0].arrAirport 返程的出发机场
$.data.flightInfo.flightInfo[0].backInfos[0].depAirport 返程的到达机场

$.data.flightInfo.flightInfo[0].backOptimizeInfo.collapeWeek 周几，如Wed
$.data.flightInfo.flightInfo[0].backOptimizeInfo.collapeTotalDuration 飞行时间，如?小时或者?小时?分钟
$.data.flightInfo.flightInfo[0].backInfos[0].planeType 机型，如空客330(大)
$.data.flightInfo.flightInfo[0].backInfos[0].airlineName 航空
$.data.flightInfo.flightInfo[0].backOverSeaTransNotice[0].transNoticeList[0].value 经停城市和时间，如台北 1小时
```

```java
{"uid":"94066d40611d5639",\"model\":\"MI 8\",\"sid\":\"E874A929-8C50-88F9-BFB4-3C16BDC6D9BD\",\"osVersion\":\"10_29\",\"gid\":\"46BAB88F-F98B-887D-E7C2-18FA93AB3C67\",\"pid\":\"10010\",\"cid\":\"C2075\",\"vid\":\"60001517\",\"userName\":\"gsglran2245\",\"mobile\":\"153Ygfe4712\",\"userId\":1185649102,\"type\":\"Android\",\"catom\":\"com.mqunar.atom.alexhome_140\",\"uuid\":\"s_FXOZUYRN6BUNRKFQCEIBIF2CIE\",\"cqp\":\"547\",\"lat\":\"\",\"lgt\":\"\",\"source\":\"pf_second_screen\",\"extMap\":{\"biz_assign_version\":\"136\"},\"encrypt\":\"1\",\"scene\":\"remind\"}
```
