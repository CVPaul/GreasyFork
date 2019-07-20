// ==UserScript==
// @name         damai_confirm
// @namespace    https://www.jwang0614.top/scripts
// @version      0.5
// @description  辅助购买大麦网演唱会门票
// @author       Olivia Wang
// @match        https://buy.damai.cn/orderConfirm*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("confirm");
    var audio = new Audio("http://audio.marsupialgurgle.com/audio/successtrumpet.mp3");


    //TODO 判断纸质票还是电子票

    var d_method = "express";

    var methods = ["electron","express", "self"];

    /** 修改配送方式，电子票index=0， 快递票index=1, 自助index=2**/
    // 默认快递票因为不需要再次填写信息
    var index = 1;
    /** 修改名字，电话号码**/
    var contact = "李显求";
    var phone = "18910036502";

    //等待wait_time秒
    var wait_time = .1;

    var contact_p = document.createElement("P");
    contact_p.appendChild(document.createTextNode(contact));
    var phone_p = document.createElement("P");
    phone_p.appendChild(document.createTextNode(phone));

    var confirm = document.createElement("P");
    confirm.appendChild(document.createTextNode("确认订单"));
    confirm.style.lineheight="20px";
    confirm.style.color="white";
    confirm.style.fontSize="12px";
    confirm.style.padding="10px 20px";
    confirm.style.background="red";
    confirm.style.position="fixed";
    confirm.style.right="10px";
    confirm.style.top="100px";
    //confirm.style.zIndex="10000";

    var container = document.querySelector('body');
    // container.appendChild(notice);
    container.appendChild(confirm);




    var way_items = document.querySelectorAll(".way-item");

    if (way_items.length > 1) {
        var selector_str = ".way-item." + methods[index] + " > .way-image";
        var ele = document.querySelector(selector_str);
        if (ele) {
            ele.click();
        }

    }

    // audio.play();


    var inputs = document.querySelectorAll(".delivery-form-row input");

    var persons = document.querySelectorAll('#confirmOrder_1 > div.dm-ticket-buyer > div.ticket-buyer-select > div.next-row.next-row-no-padding.buyer-list > div > label > span.next-checkbox.isFirefox > span');
    console.log(persons);
    if (persons.length !== 0) {
        for(var i = 0; i < persons.length; i++) {
            persons[i].click();
        }
    }
    if (inputs.length === 0) {
        // 不需要填写
        document.querySelector('#confirmOrder_1 > div.submit-wrapper > button').click();

    } else {

        // 等待用户输入姓名和电话
        sleep(wait_time * 1000).then(()=>{
            document.querySelector('#confirmOrder_1 > div.submit-wrapper > button').click();

        });


    }

    confirm.onclick = function(){
        this.style.background = "grey";
        document.querySelector('#confirmOrder_1 > div.submit-wrapper > button').click();
    };

})();


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}