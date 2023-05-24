"ui";
ui.statusBarColor("#373bd3");
ui.layout(
    <frame w="*" h="*">
        <vertical bg="#f6f6f6">
            <appbar bg="#373bd3">
                <text text="京淘自动助手" textSize="18" textStyle="bold" textColor="#ffffff" h="45" gravity="center_vertical|center_horizontal" />
            </appbar>
            <viewpager id="viewpager">
                <vertical id='首页' padding='10 15 10 50'>
                    <card id="权限开关" h='60' cardCornerRadius="5" cardElevation="0">
                        <View bg="#ffffff" />
                        <horizontal layout_gravity="center|center" w="auto" h="auto">
                            <Switch id="switchAutoServices" text="无障碍权限" textStyle="bold" textSize="16" textColor="#555555" checked="{{auto.service != null}}" marginRight='50' />
                            <Switch id="switchFloaty" text="悬浮窗权限" textStyle="bold" textSize="16" textColor="#555555" checked="{{floaty.checkPermission() != false}}" />
                        </horizontal>
                    </card>
                    <card marginTop="20" cardCornerRadius="5" cardElevation="0" >
                        <vertical id="任务按钮" padding="20">
                            <card id="jdstart" h='55' cardCornerRadius="5" cardElevation="0" foreground="?selectableItemBackground">
                                <View bg="#f1f1fb" />
                                <text id="jdText" textSize="17" textStyle="bold" textColor="#222222" gravity="center_vertical|center_horizontal">京东618任务</text>
                            </card>
                            <card id="tbstart" h='55' marginTop="10" cardCornerRadius="5" cardElevation="0" foreground="?selectableItemBackground">
                                <View bg="#f1f1fb" />
                                <text id="tbText" textSize="17" textStyle="bold" textColor="#222222" gravity="center_vertical|center_horizontal">淘宝618任务</text>
                            </card>
                        </vertical>
                    </card>

                    <card marginTop="40" cardCornerRadius="5" cardElevation="0" foreground="?selectableItemBackground" h="auto">
                        <text id='noticeContent' padding="25 20" textColor="#999999" />
                    </card>
                </vertical>
                <vertical id='帮助页面'>
                    <ScrollView>
                        <vertical padding='10 15 10 50'>
                            <horizontal>
                                <card id="luntan" w="180" h="50" marginRight="5" cardCornerRadius="5" cardElevation="0" foreground="?selectableItemBackground">
                                    <View bg="#ffffff" />
                                    <text textColor="#333333" gravity="center_vertical|center_horizontal">Github</text>
                                </card>
                                <card id="fabudizhi" w="*" h="50" cardCornerRadius="5" cardElevation="0" foreground="?selectableItemBackground">
                                    <View bg="#ffffff" />
                                    <text textColor="#333333" gravity="center_vertical|center_horizontal">APP发布地址</text>
                                </card>
                            </horizontal>

                            <card h="auto" marginTop="20" cardCornerRadius="10" cardElevation="0">
                                <View bg="#ffffff" />
                                <vertical margin='20 0' padding="0 15" layout_gravity="center_vertical" h="auto">
                                    <text marginBottom='10' textColor="#e06666">1.不要双开应用（京东/淘宝）,可能无法打开APP。</text>
                                    <text marginBottom='10' textColor="#e06666">2.不要使用虚拟按键，就是屏幕底部有菜单、主页、返回按键；某些场景下无法准确获取屏幕宽高，可能导致脚本出错。</text>
                                    <text marginBottom='10'>3.软件需要 无障碍权限 、 悬浮窗权限 ，请务必授予这两项权限，否则无法自动完成任务。</text>
                                    <text marginBottom='10'>4.软件基于Autojs 4.1打包，这是一个开源的软件，而本软件有几十项权限都是Autojs自带得权限，无法自由选择，我也没办法。这些额外权限其实并没有被用到，只用到了无障碍权限和悬浮窗权限（摊手.jpg）。</text>
                                    <text marginBottom='15'>5.由于无障碍权限打开京东淘宝自动完成任务，部分手机管家可能误报为诱导软件，实际上本软件绝无任何病毒行为，请放心使用。</text>
                                    <text>本软件仅供学习参考使用，请勿用于非法用途，请于下载后的24小时内删除。如果您执意使用该软件导致的任何结果与开发者无关。</text>
                                </vertical>
                            </card>
                        </vertical>
                    </ScrollView>
                </vertical>

            </viewpager >
        </vertical >
        <tabs id="tabs" bg="#ffffff" layout_gravity="bottom" h="50" tabIndicatorHeight="0" tabTextColor="#bbbbbb" tabSelectedTextColor="#373bd3" />
    </frame>
);
ui.viewpager.setTitles(["开始", "帮助"]);
ui.tabs.setupWithViewPager(ui.viewpager);
ui.jdstart.on("click", function () {
    threads.start(function () {
        toast('脚本启动中...')
        let online = http.get("https://api.wahaojia.com/JTZDZS/jd-task.js")
        if (online.statusCode != 200) {
            alert('启动失败', "脚本启动失败，请联系开发者反馈")
            threads.shutDownAll()
        }
        let codeStr = online.body.string()
        engines.execScript("jd-task", codeStr)
    })
});
ui.tbstart.on("click", function () {
    threads.start(function () {
        toast('脚本启动中...')
        let online = http.get("https://api.wahaojia.com/JTZDZS/tb-task.js")
        if (online.statusCode != 200) {
            alert('启动失败', "脚本启动失败，请联系开发者")
            threads.shutDownAll()
        }
        let codeStr = online.body.string()
        engines.execScript("tb-task", codeStr)
    })
});
ui.fabudizhi.on("click", function () {
    app.openUrl(storages.create("appinit").get('downUrl'))
});
ui.luntan.on("click", function () {
    app.openUrl('https://github.com/ashuang360/jtzdzs')
});
ui.switchAutoServices.on("check", function (checked) {
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});
ui.switchFloaty.on("check", function (checked) {
    importClass(android.content.Intent);
    importClass(android.net.Uri);
    importClass(android.provider.Settings);
    var intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:" + context.getPackageName()));
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    app.startActivity(intent);
});
ui.emitter.on("resume", function () {

    ui.switchAutoServices.checked = auto.service != null;
    ui.switchFloaty.checked = floaty.checkPermission() != false
});
var start = threads.start(function () {
    try {
        let appVersion = parseFloat(app.versionName)
        let online = http.get("https://api.wahaojia.com/JTZDZS/app-update.json");
        let onlineStr = online.body.string();
        let update = JSON.parse(onlineStr)
        storages.create("appinit").put('downUrl', update.url)
        ui.run(function () {
            ui.noticeContent.setText(update.notice);
            ui.jdText.setText(update.mainTask.jd)
            ui.tbText.setText(update.mainTask.tb)
        })
        if (!/20\d{6}.*/.test(update.version)) {
            toast("检查更新失败");
            threads.shutDownAll()
        }
    } catch (err) {
        log(err)
    }

})



