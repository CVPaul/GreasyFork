// ==UserScript==
// @name         damai_selection
// @namespace    https://github.com/CVPaul/GreasyFork.git
// @version      0.6
// @description  辅助购买大麦网演唱会门票
// @author       Paul Li
// @match        https://detail.damai.cn/*
// @grant        none
// ==/UserScript==

(function() {
    //'use strict';
    // Your code here...
    if(!window.localStorage){
        alert('不支持这个浏览器，请换成Chrome或者Safari。');
        return null;
    }

    /****  改人数  ***/
    var people_num = 2;
    var slc_event_index = [];
    var slc_price_index = [6,4,5,0,1,2,3];

    var storage = window.localStorage;
    storage.setItem("people_num", people_num);
    //storage.clear();

    var start = document.createElement("P");
    start.appendChild(document.createTextNode("Start(ctrl+E)"));
    start.style.lineheight="20px";
    start.style.color="white";
    start.style.fontSize="12px";
    start.style.padding="10px 20px";
    start.style.background="green";
    start.style.position="fixed";
    start.style.right="10px";
    start.style.top="100px";
    // start.style.zIndex="10000";
    // start.style.top=window.innerHeight;

    var stop = document.createElement("P");
    stop.appendChild(document.createTextNode("Stop(ctrl+T)"));
    stop.style.lineheight="20px";
    stop.style.color="white";
    stop.style.fontSize="12px";
    stop.style.padding="10px 20px";
    stop.style.background="black";
    stop.style.position="fixed";
    stop.style.right="10px";
    stop.style.top="150px";
    // stop.style.zIndex="10000";

    var container = document.querySelector('body');
    container.appendChild(start);
    container.appendChild(stop);

    reload_page();

    document.onkeydown = function() {
        var oEvent = window.event;
        if (oEvent.keyCode == 69 && oEvent.ctrlKey) {
            start.click();
        }else if (oEvent.keyCode == 84 && oEvent.ctrlKey) {
            stop.click();
        }
    }

    function timedRefresh(timeoutPeriod) {
        window.setTimeout(location.reload(true),timeoutPeriod);
    }

    start.onclick = function() {
        console.log('开始抢票！');
        //blinkStart();
        document.querySelector('body > div.perform').style.background="darksalmon";
        storage.setItem("isRunning", true);

        get_numbers_from_page();
        // set_up_check_page();

        timedRefresh(500);

    };

    stop.onclick = function() {
        alert('停止抢票！');
        document.querySelector('body > div.perform').style.background="white";
        storage.setItem("isRunning", false);
        storage.removeItem("isRunning");
        storage.removeItem("price_ele_num");
        storage.removeItem("event_ele_num");
        storage.removeItem("people_num");
        storage.clear();
    };

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function set_up_check_page() {
        console.log("set up check page");

        var event_ele_num = storage.getItem("event_ele_num");
        var price_ele_num = storage.getItem("price_ele_num");
        var people_num = storage.getItem("people_num");

        if (storage.getItem("isRunning") == "true") {
            var perform_ele = document.querySelector('body > div.perform');
            if (perform_ele) {
                perform_ele.style.background="darksalmon";
            }

        }
        var event_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__order__select.perform__order__select__performs > div.select_right > .select_right_list > .select_right_list_item');

        event_selections[event_ele_num].click();
        console.log("event");

        sleep(50).then(() => {
            var price_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__desc__info + div > div.select_right > .select_right_list > .select_right_list_item');

            if (price_selections[price_ele_num]) {
                price_selections[price_ele_num].click();
                console.log("price");
                sleep(50).then(()=>{
                    var people_selection = document.querySelector(".cafe-c-input-number-input");
                    if (people_selection) {
                        var people_inc_btn = document.querySelector('a.cafe-c-input-number-handler.cafe-c-input-number-handler-up');
                        for (var i =1; i < people_num; i++) {
                            people_inc_btn.click();
                            console.log("inc");
                        }
                    };
                    sleep(50).then(()=>{
                        var btn = document.querySelector("body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div:last-child > div");
                        console.log(btn);
                        if (btn) {
                            if (btn.innerText == "立即购买" || btn.innerText == "立即预定") {
                                storage.removeItem("isRunning");
                                storage.removeItem("price_ele_num");
                                storage.removeItem("event_ele_num");
                                storage.removeItem("people_num");
                                storage.clear();
                                btn.click();
                            }
                        }

                    });
                    if (storage.getItem("isRunning") == "true") {
                        console.log("refreshing");
                        timedRefresh(100);
                    }
            });
            } else {
                console.log("price_selections not found");
                timedRefresh(400);
            }
        });
    }

    function get_numbers_from_page() {
        var event_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__order__select.perform__order__select__performs > div.select_right > div > div');
        var price_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__desc__info + div > div.select_right > div > div');
        if (slc_event_index.length > 0){
            for (var idx0 = 0; idx0 < slc_event_index.length; idx0++){
                var i0 = slc_event_index[idx0];
                if (event_selections[i0].classList.contains("active")) {
                    storage.setItem("event_ele_num", i0);
                    break;
                }
            }
        }else{
            for (var i = 0;i < event_selections.length;i++) {
                if (event_selections[i].classList.contains("active")) {
                    storage.setItem("event_ele_num", i);
                    break;
                }
            }
        }
        if (slc_price_index.length > 0){
            for (var idx1 = 0; idx1 < slc_price_index.length; idx1++){
                var j0 = slc_price_index[idx1];
                if (price_selections[j0]) {
                    // price_selections[j0].classList.contains("active")
                    // console.log('check',price_selections[j0].querySelector('span.notticket'));
                    if (price_selections[j0].querySelector('span.notticket')){
                        continue;
                    }
                    price_selections[j0].click();
                    storage.setItem("price_ele_num", j0);
                    break;
                }
            }
            // price_selections.length();
        }else{
            for (var j= 0;j < price_selections.length;j++) {
                if (price_selections[j].classList.contains("active")) {
                    storage.setItem("price_ele_num", j);
                    break;
                }
            }
        }
    }

    function reload_page() {
        //console.log("reload");
        //alert(storage.getItem("isRunning"));
        window.setTimeout(set_up_check_page,100);
    }
})();