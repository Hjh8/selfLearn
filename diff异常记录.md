## list

```json
{"bstatus":{"code":3,"status":0,"des":"当前搜索无航线，请更换城市重新搜索"},"traceId":"f_haders_linker_221111.171042.10.67.206.254.160.175523_1","startTime":0,"endTime":0,"elapsedMillis":0,"nextQtrace":"{\"list\":\"f_haders_linker_221111.171042.10.67.206.254.160.175523_1\"}","sys":{"startTime":1668157843000,"endTime":1668157846374,"upPackSize":2844,"downPackSize":31617,"nextQtrace":"{\"list\":\"f_haders_linker_221111.171042.10.67.206.254.160.175523_1\"}"}
```



## ota

```json
{"bstatus": {"code":-1,"status":-1,"des":"服务器异常，请稍候重试！"},      "sys": {"startTime":1668157808743,"endTime":1668157809322,"upPackSize":3120,"downPackSize":0,"nextQtrace":"{\"list\":\"ops_slugger_221111.164002.10.89.32.22.1471292.501223877_1\",\"ota\":\"f_haders_linker_221111.171008.10.67.206.254.160.175007_1\"}"},      "traceId": "f_haders_linker_221111.171008.10.67.206.254.160.175007_1",      "startTime": 1668157808743,      "endTime": 1668157809322,      "elapsedMillis": 579,      "nextQtrace": "{\"list\":\"ops_slugger_221111.164002.10.89.32.22.1471292.501223877_1\",\"ota\":\"f_haders_linker_221111.171008.10.67.206.254.160.175007_1\"}"}
```

```
没B参导致B参替换失败
```

出现ota不显示，但book显示。可能是并发插入数据库时出现错误。

```json
{"bstatus": {"code":15,"status":1,"des":"没有查询到此航班的价格信息"},      "sys": {"startTime":1668395898500,"endTime":1668395898706,"upPackSize":3124,"downPackSize":103,"nextQtrace":"{\"list\":\"ops_slugger_221114.100018.10.89.68.12.3045797.1389933557_1\",\"ota\":\"f_haders_linker_221114.111818.10.68.53.144.177.3844465_1\"}"},      "traceId": "f_haders_linker_221114.111818.10.68.53.144.177.3844465_1",      "startTime": 1668395898500,      "endTime": 1668395898706,      "elapsedMillis": 206,      "nextQtrace": "{\"list\":\"ops_slugger_221114.100018.10.89.68.12.3045797.1389933557_1\",\"ota\":\"f_haders_linker_221114.111818.10.68.53.144.177.3844465_1\"}"} ####QTraceId[f_haders_linker_221114.111818.10.68.53.144.177.3844465_1]-QSpanId[1]
```





## book

```json
{"bstatus":{"code":1,"status":1,"des":"对不起，您预订的航班已经售完，请重新搜索预订"},"traceId":"f_haders_linker_221111.171018.10.67.206.254.160.175171_9","startTime":0,"endTime":0,"nextQtrace":"{\"av\":\"f_haders_linker_221111.171018.10.67.206.254.160.175171_9\",\"list\":\"ops_slugger_221111.152726.10.95.133.34.79350.838999669_1\",\"ota\":\"ops_slugger_221111.152729.10.95.133.34.79350.4856174105_1\"}"
```



```json
{"bstatus":{"code":-1,"status":-1,"des":"服务器异常，请稍候重试！"},"traceId":"f_haders_linker_221114.111826.10.68.53.144.177.3844577_1","startTime":0,"endTime":0,"nextQtrace":"{\"av\":\"f_haders_linker_221114.111826.10.68.53.144.177.3844577_1\",\"list\":\"ops_slugger_221114.092001.10.89.68.52.2359084.2641427048_1\",\"ota\":\"ops_slugger_221114.092003.10.89.68.52.2359084.692897192_1\"}","sys":{"startTime":1668395906826,"endTime":1668395907307,"upPackSize":10985,"downPackSize":2345,"traceId":"f_haders_linker_221114.111826.10.68.53.144.177.3844577_1"},"flightGlobal":{},"data":{"bstatus":{"code":-1,"status":-1,"des":"服务器异常，请稍候重试！"},"startTime":1668395906826,"endTime":1668395907307,"sys":{"startTime":1668395906826,"endTime":1668395907307,"upPackSize":10985,"downPackSize":2345,"traceId":"f_haders_linker_221114.111826.10.68.53.144.177.3844577_1"},"flightGlobal":{},"maxPassengersNum":0,"childNumPerAdult":2,"avInvalidTime":90,"bookType":0,"maxAge":200,"minAge":0,"showType":1,"passengerSize":0,"productTimeValid":false,"needCloseLocalFillOrder":false,"detainmentFrequency":0,"detainmentCount":0,"showHeadInfoArrows":0,"defaultSelect":0,"needSelectBuyTicketHintTip":false,"bookingPopInfoType":0,"flightVipPriceTip":false,"userAlwaysCheckInHotel":false,"mulitiPriceInfos":[],"airlinesMemberFlag":false,"researchPrice":false,"sd":{"sdid":"1ba63d81095871f967657e2684625344"}}} ####QTraceId[f_haders_linker_221114.111826.10.68.53.144.177.3844577_1]-QSpanId[1]
```







## submit

```json
{"bstatus":{"code":3,"status":3,"des":"抱歉，订单创建失败，请重新选择航班"},"traceId":"f_haders_linker_221114.111842.10.68.53.144.177.3845033_1","startTime":0,"endTime":0,"nextQtrace":"{\"submit\":\"f_haders_linker_221114.111842.10.68.53.144.177.3845033_1\",\"av\":\"ops_slugger_221114.101257.10.90.5.78.723780.5278497407_1\",\"recommend\":\"ops_slugger_221114.101624.10.90.4.201.2253437.7728824168_1\",\"list\":\"ops_slugger_221114.101116.10.90.75.72.859884.4236912798_1\",\"ota\":\"ops_slugger_221114.101204.10.90.75.73.4076593.8476730293_1\"}","sys":{"startTime":1668395923381,"endTime":1668395923676,"upPackSize":99433,"downPackSize":675,"traceId":"f_haders_linker_221114.111842.10.68.53.144.177.3845033_1"},"flightGlobal":{},"data":{"bstatus":{"code":3,"status":3,"des":"抱歉，订单创建失败，请重新选择航班"},"sysStatus":{"code":3,"status":-1000,"des":"对不起，订单提交失败，请重新选择航班"},"startTime":1668395923381,"endTime":1668395923676,"sys":{"startTime":1668395923381,"endTime":1668395923676,"upPackSize":99433,"downPackSize":675,"traceId":"f_haders_linker_221114.111842.10.68.53.144.177.3845033_1"},"flightGlobal":{},"silentRefresh":{"refreshPages":["1"],"refreshSource":"innerSubmitCombine"},"abtest":{"extraSaleSwitch":false,"showTimer":false},"sysExtMap":{"ip":"10.68.53.144"},"sd":{"sdid":"172638710a58847667a04a5530578560"}}} ####QTraceId[f_haders_linker_221114.111842.10.68.53.144.177.3845033_1]-QSpanId[1]
```



```json
{"bstatus":{"code":3,"status":3,"des":"抱歉，订单创建失败，请重新选择航班"},"traceId":"f_haders_linker_221114.111833.10.68.53.144.177.3844748_1","startTime":0,"endTime":0,"nextQtrace":"{\"submit\":\"f_haders_linker_221114.111833.10.68.53.144.177.3844748_1\",\"av\":\"ops_slugger_221114.110030.10.95.133.34.79375.7509812929_1\",\"recommend\":\"ops_slugger_221114.110033.10.95.133.34.79375.6992350842_1\",\"list\":\"ops_slugger_221114.110000.10.95.133.34.79375.7271312232_1\",\"ota\":\"ops_slugger_221114.110006.10.95.133.34.79375.6925042145_1\"}","sys":{"startTime":1668395914576,"endTime":1668395914681,"upPackSize":209387,"downPackSize":640,"traceId":"f_haders_linker_221114.111833.10.68.53.144.177.3844748_1"},"flightGlobal":{},"data":{"bstatus":{"code":3,"status":3,"des":"抱歉，订单创建失败，请重新选择航班"},"sysStatus":{"code":3,"status":4,"des":"生单接口参数错误"},"startTime":1668395914576,"endTime":1668395914681,"sys":{"startTime":1668395914576,"endTime":1668395914681,"upPackSize":209387,"downPackSize":640,"traceId":"f_haders_linker_221114.111833.10.68.53.144.177.3844748_1"},"flightGlobal":{},"silentRefresh":{"refreshPages":["1"],"refreshSource":"innerSubmitOneWay"},"abtest":{"extraSaleSwitch":false,"showTimer":false},"sysExtMap":{"ip":"10.68.53.144"},"sd":{"sdid":"14663ab109b88d62943047a49c532608"}}} ####QTraceId[f_haders_linker_221114.111833.10.68.53.144.177.3844748_1]-QSpanId[1]
```



```json
{"bstatus":{"code":60,"status":60,"des":"抱歉，该价格的机票已经售完，请重新搜索预订"},"traceId":"f_haders_linker_221115.143357.100.85.138.152.56884.227_1","startTime":0,"endTime":0,"nextQtrace":"{\"submit\":\"f_haders_linker_221115.143357.100.85.138.152.56884.227_1\",\"av\":\"ops_slugger_221115.125345.10.89.68.12.3045798.7517427860_1\",\"recommend\":\"ops_slugger_221115.125351.10.89.68.12.3045798.6854970030_1\",\"list\":\"ops_slugger_221115.125110.10.89.68.12.3045781.9324428622_1\",\"ota\":\"ops_slugger_221115.125224.10.89.68.12.3045781.6697010371_1\"}","sys":{"startTime":1668494037741,"endTime":1668494037945,"upPackSize":213416,"downPackSize":5313,"traceId":"f_haders_linker_221115.143357.100.85.138.152.56884.227_1"},"flightGlobal":{},"data":{"bstatus":{"code":60,"status":60,"des":"抱歉，该价格的机票已经售完，请重新搜索预订"},"sysStatus":{"code":60,"status":8,"des":"异步bookingTag 非法"},"startTime":1668494037741,"endTime":1668494037945,"sys":{"startTime":1668494037741,"endTime":1668494037945,"upPackSize":213416,"downPackSize":5313,"traceId":"f_haders_linker_221115.143357.100.85.138.152.56884.227_1"}
```





```java
{"cp":2,"re":0,"cid":"C5454","uid":"220c9f8bb23e4c6d","gid":"D8B1EEC4-5E26-5F9C-EF48-708E3361E0C7","pid":"10010","vid":"60001517","msg":"","aid":"","avers":"","model":"NOH-AN01","osVersion":"12_31","sid":"D6F11FD6-18F0-253D-C0B1-BA6F1BE24D5A","t":"f_flight_rn_domestic_submit","ip":"39.144.105.112","adid":"220c9f8bb23e4c6d","iid":"","un":"lkwo1385","nt":"cmnet","usid":"157015070","mno":"46000","port":"32055","ref":"f_major_bundle_rn#OrderFillView","brush":"{\"lt\":\"0\"}","lat":"31.189138","lgt":"121.309448","catom":"","atomId":190,"cas":"com.mqunar.atom.flight_190","versionCode":"","qcookie":"","vcookie":"","tcookie":"","scookie":"","rnVersion":1625,"cqp":"f_major_bundle_rn#1625","openId":"","unionId":"","bd_source":"","bd_origin":"","platform":"","plat":"harmony","qpInfos":"{\"f_flight_additional_bundle_rn\":92,\"f_flight_fuwu_rn\":97,\"f_home_rn\":472,\"route_service_rn\":156,\"flight_seat_rn\":330,\"h_home_rn\":1852,\"f_order_rn\":386,\"flight_booking_rn\":383,\"f_major_bundle_rn\":1625,\"gl_home_rn\":381,\"f_flight_search_rn\":535}","qn205":"","qn300":"","snapshotQTrace":"","browserFp":"","qn48":"","ke":"1668573134414","ma":"62:11:C5:3D:93:6D"}
```



```java
{"cp":2,"re":0,"cid":"C5454","uid":"220c9f8bb23e4c6d","gid":"D8B1EEC4-5E26-5F9C-EF48-708E3361E0C7","pid":"10010","vid":"60001517","msg":"","aid":"","avers":"","model":"NOH-AN01","osVersion":"12_31","sid":"D6F11FD6-18F0-253D-C0B1-BA6F1BE24D5A","t":"f_flight_rn_domestic_submit","ip":"39.144.105.112","adid":"220c9f8bb23e4c6d","iid":"","un":"lkwo1385","nt":"cmnet","usid":"157015070","mno":"46000","port":"32055","ref":"f_major_bundle_rn#OrderFillView","brush":"{\"lt\":\"0\"}","lat":"31.189138","lgt":"121.309448","catom":"","atomId":190,"cas":"com.mqunar.atom.flight_190","versionCode":"","qcookie":"","vcookie":"","tcookie":"","scookie":"","rnVersion":1625,"cqp":"f_major_bundle_rn#1625","openId":"","unionId":"","bd_source":"","bd_origin":"","platform":"","plat":"harmony","qpInfos":"{\"f_flight_additional_bundle_rn\":92,\"f_flight_fuwu_rn\":97,\"f_home_rn\":472,\"route_service_rn\":156,\"flight_seat_rn\":330,\"h_home_rn\":1852,\"f_order_rn\":386,\"flight_booking_rn\":383,\"f_major_bundle_rn\":1625,\"gl_home_rn\":381,\"f_flight_search_rn\":535}","qn205":"","qn300":"","snapshotQTrace":"","browserFp":"","qn48":"","ke":"1668573134414","ma":"62:11:C5:3D:93:6D"}
```



```java
{"st_pn":"DetailView","mode":"QRN","source":"f_order_rn","cat":"tc-orderlist-wirelessList","catNewPrefix":"f_order_rn---DetailView---NONE---QRN","hotelHomeRnVersion":1845,"uuid":"s_R6BUUMOMIJ7QPD3B5UI6T5XJL4","abtMap":{},"userId":"157015070","mobile":"","orderNo":"daw221116125744109","showOrderNo":"","domain":"xep.trade.qunar.com","otaType":1,"refer":2,"canShare":false,"shareOrder":false,"fromType":0,"pangolin":false,"flightMarjorBundleRnVersion":1622,"userCancel":false}
```



```java
2022-11-16 14:19:46:122: QTraceId[f_athena_gateway_221116.141946.10.93.41.72.19108.307681_1]-QSpanId[1.9.1] 8 f_athena_gateway(10.93.41.72:32810) -> f_athena_order(10.93.176.138:30900) com.qunar.flight.postservice.athena.orderapi.detail.IOrderDetailInfoService:1.0.0 queryOrderInfo(com.qunar.flight.postservice.athena.orderapi.detail.request.orderinfo.OrderDetailRequest,com.qunar.flight.postservice.athena.orderapi.detail.request.common.BizCommonVO) DONE [{"mver":null,"st_pn":"DetailView","vid":null,"mode":"QRN","source":"f_order_rn","cat":"tc-orderlist-wirelessList","catNewPrefix":"f_major_bundle_rn---DetailView---NONE---QRN","ext":null,"hotelHomeRnVersion":1845,"uuid"
:"s_R6BUUMOMIJ7QPD3B5UI6T5XJL4","abtMap":{},"traceInfo":null,"commonParamVO":null,"userId":"157015070","mobile":"","orderNo":"daw221116
125744109","showOrderNo":"","domain":"xep.trade.qunar.com","otaType":1,"refer":2,"canShare":false,"shareOrder":false,"fromType":0,"toke
n":"bd5fd854c89444d8ade2395465c014fb","md5":null,"pangolin":false,"orderContext":null,"flightMarjorBundleRnVersion":null,"userCancel":f
alse},{"cp":2,"re":0,"cid":"C5454","uid":"220c9f8bb23e4c6d","gid":"D8B1EEC4-5E26-5F9C-EF48-708E3361E0C7","pid":"10010","vid":"60001517"
,"msg":"","aid":"","avers":"","model":"NOH-AN01","osVersion":"12_31","sid":"D6F11FD6-18F0-253D-C0B1-BA6F1BE24D5A","t":"f_od_order_detai
l","ip":"39.144.105.112","adid":"220c9f8bb23e4c6d","iid":"","un":"lkwo1385","nt":"cmnet","usid":"157015070","mno":"46000","port":"32055
","ref":"f_major_bundle_rn#OrderFillView","brush":"{\"lt\":\"0\"}","lat":"31.189138","lgt":"121.309448","catom":"","atomId":190,"cas":"com.mqunar.atom.flight_190","versionCode":"","qcookie":"","vcookie":"","tcookie":"","scookie":"","rnVersion":1625,"cqp":"f_major_bundle_rn#1625","openId":"","unionId":"","bd_source":"","bd_origin":"","platform":"","idfa":null,"idfv":null,"imageUUID":null,"netType":null,"pitcherTid":null,"plat":"harmony","resolution":null,"mode":null,"qpInfos":"{\"f_flight_additional_bundle_rn\":92,\"f_flight_fuwu_rn\":97,\"f_home_rn\":472,\"route_service_rn\":156,\"flight_seat_rn\":330,\"h_home_rn\":1852,\"f_order_rn\":386,\"flight_booking_rn\":383,\"f_major_bundle_rn\":1625,\"gl_home_rn\":381,\"f_flight_search_rn\":535}","hotelHomeQp":"1845","fp":null,"touch_cid":"","touch_pid":"","touch_vid":"","uuid":null,"ke":"","ma":"","xRealIP":null}]
 Return value({"bstatus":{"code":-2,"des":"获取订单失败，请通过机票订单查询进行查看"},"resmap":null,"traceId":null,"serverStartTime":0,"serverEndTime":0,"data":null,"redirectSchema":null,"cacheValidMillis":604800000,"cacheRecordFlag":false})
```



```
 �   {"bstatus":{"code":2,"des":"生成token失败"},"resmap":null,"traceId":null,"serverStartTime":1668601357911,"serverEndTime":1668601357922,"data":null}
```

