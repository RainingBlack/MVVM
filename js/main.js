/**
 * Created by Administrator on 2017/6/21.
 */
window.onload=function () {
    /**
     * 这是使用订阅和发布实现的一个demo
     */
    var SPublish = (function () {
        var tid = 0,
            arrEvent = {};
        var sublish = function (name, func) {
            if(name){
                arrEvent[name] || (arrEvent[name] = []);
                tid++;
                arrEvent[name].push({
                    tid : tid,
                    func : func
                });
            }
        };
        var publish = function (name, args) {
            if(arrEvent[name]){
                for(var t of arrEvent[name]){
                    t.func(args);
                }
            }else
                return;
        }
        return {
            sublish : sublish,
            publish : publish
        }
    })();

    var spanChange = function (str) {
        document.getElementsByClassName('input1bind')[0].innerHTML = str;
    }
    //订阅事件  这里只订阅一个，可以订阅多个
    SPublish.sublish('testMVVM',spanChange);

    //绑定事件并完成发布  IE用propertychange
    document.getElementsByClassName('input1')[0].addEventListener('input',function (e) {
        SPublish.publish('testMVVM',e.currentTarget.value);
    },false);

    /**
     * 使用脏值查询的方法 这里用setInterval
     */
    var DomArr = {
        input : document.getElementsByClassName('input2')[0],
        span : document.getElementsByClassName('input2bind')[0]
    }
    //这里是单例模式，也可以做成工厂模式
    var watcher = {
        target : undefined,
        dirty : false,
        timer : undefined,
        _timerCount : 0,
        get timerCount (){ //获得表达式当前求值, 此函数在解析时，已经生成
            return this._timerCount;
        },
        set timerCount (value){  // 有些表达式可以生成set函数， 用于处理赋值, 这个一般用于双向绑定的场景
            if(this.last !== this.target.value){
                this.dirty = true;
            }else{
                this.dirty = false;
            }

            this.last = this.target.value;
            this._timerCount = value;
        },
        last: undefined// 上一次表达式的求值结果
    }
    var $watcher = function (targetName) {
        watcher.target = document.getElementsByClassName(targetName)[0];
        return watcher;
    }
    var span2Change = function (str) {
        document.getElementsByClassName('input2bind')[0].innerHTML = str;
    }
    //绑定并初始化
    var curTar = $watcher('input2');

    //这里设置轮训函数，如果用setInterval表示很浪费，所以使用触发式的setTimeout，暂定得到焦点触发，失去焦点则不再监听
    curTar.target.addEventListener('focus',function (e) {
        curTar.timer = setInterval(function () {
            curTar.timerCount = curTar.timerCount+1;
            if(curTar.dirty){
                span2Change(curTar.target.value);
            }
        },100);
    });
    curTar.target.addEventListener('blur',function (e) {
        clearInterval(curTar.timer);
        curTar.timer = null;
    });

    /**
     * 使用数据劫持的方式  主要是使用了 Object.defineProperty的方式
     */
    var vm = new MVVM({
        el: '#mvvmTest',
        data: {
            someStr: ''
        },
        computed: {
            getValue: function() {
                return this.someStr;
            }
        }
    });
}

































