// Clash极简分流脚本
const EXCLUDE_KEYWORDS_PATTERN = "邀请返佣|重新从网站获取订阅|公告信息|重置|套餐|剩余|到期|主页|官网|游戏|关注|网站|网址|地址|有效|禁止|邮箱|发布|客服|订阅|节点|问题|联系|https?:\\/\\/|\\.[a-z]{2,}";
const globalExcludeKeywords = new RegExp(`(${EXCLUDE_KEYWORDS_PATTERN})`, "i");

function main(params) {
    if (!params || !params.proxies || !Array.isArray(params.proxies)) {
        console.error("Invalid params or proxies not found");
        return params;
    }
    const beforeCount = params.proxies.length;
    params.proxies = params.proxies.filter(p => !globalExcludeKeywords.test(p.name));
    const filteredCount = beforeCount - params.proxies.length;
    if (filteredCount > 0) console.log(`已过滤 ${filteredCount} 个无效节点`);

    try {
        overwriteBasicOptions(params);
        overwriteDns(params);
        overwriteFakeIpFilter(params);
        overwriteNameserverPolicy(params);
        overwriteHosts(params);
        overwriteTunnel(params);
        overwriteProxyGroups(params);
        overwriteRules(params);
        console.log("极简配置加载完成");
    } catch (err) {
        console.error("脚本执行异常：", err);
    }
    return params;
}

function overwriteBasicOptions(params) {
    const baseOpt = {
        "mixed-port": 7897,
        "allow-lan": true,
        mode: "rule",
        "log-level": "warning",
        ipv6: false,
        "find-process-mode": "off",
        profile: { "store-selected": true, "store-fake-ip": true },
        "unified-delay": true,
        "tcp-concurrent": true,
        "global-client-fingerprint": "chrome",
        sniffer: {
            enable: true,
            sniff: {
                HTTP: { ports: [80, "8080-8880"], "override-destination": true },
                TLS: { ports: [443, 8443], "override-destination": true },
                QUIC: { ports: [443, 8443] }
            },
            "skip-domain": ["+.mesh.mihome.io", "+.push.apple.com", "+.push.googleapis.com", "+.mtalk.google.com"]
        }
    };
    Object.assign(params, baseOpt);
}

function overwriteDns(params) {
    params.dns = {
        enable: true,
        "prefer-h3": false,
        ipv6: false,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        nameserver: ["https://223.5.5.5/dns-query", "https://doh.pub/dns-query"],
        "proxy-server-nameserver": ["223.5.5.5", "119.29.29.29"],
        fallback: ["https://1.1.1.1/dns-query", "https://dns.google/dns-query"],
        "default-nameserver": ["223.5.5.5", "119.29.29.29"]
    };
}

function overwriteFakeIpFilter(params) {
    params.dns["fake-ip-filter"] = [
        "*.m2m", "*.bogon", "*.lan", "*.local", "*.internal", "*.localdomain",
        "+.injections.adguard.org", "+.local.adguard.org", "+.home.arpa",
        "dns.msftncsi.com", "*.srv.nintendo.net", "*.stun.playstation.net",
        "xbox.*.microsoft.com", "*.xboxlive.com", "*.turn.twilio.com",
        "*.stun.twilio.com", "stun.syncthing.net", "stun.*", "*.sslip.io",
        "*.nip.io", "*.example.com", "+.internal.corp"
    ];
}

function overwriteNameserverPolicy(params) {
    const policyGroups = [
        {
            dnsTarget: "quic://dns.alidns.com:853",
            domains: [
                "dns.alidns.com", "+.uc.cn", "+.alibaba.com", "*.alicdn.com", "*.ialicdn.com", "*.myalicdn.com",
                "*.alidns.com", "*.aliimg.com", "+.aliyun.com", "*.aliyuncs.com", "*.alikunlun.com", "*.alikunlun.net",
                "*.cdngslb.com", "+.alipay.com", "+.alipay.cn", "+.alipay.com.cn", "*.alipayobjects.com", "+.alibaba-inc.com",
                "*.alibabausercontent.com", "*.alibabadns.com", "+.alibabachengdun.com", "+.alicloudccp.com", "+.alipan.com",
                "+.aliyundrive.com", "+.aliyundrive.net", "+.cainiao.com", "+.cainiao.com.cn", "+.cainiaoyizhan.com",
                "+.guoguo-app.com", "+.etao.com", "+.yitao.com", "+.1688.com", "+.amap.com", "+.gaode.com", "+.autonavi.com",
                "+.dingtalk.com", "+.mxhichina.com", "+.soku.com", "+.tb.cn", "*.tbcdn.cn", "+.taobao.com", "*.taobaocdn.com",
                "*.tbcache.com", "+.tmall.com", "+.goofish.com", "+.xiami.com", "+.xiami.net", "*.ykimg.com", "+.youku.com",
                "+.tudou.com", "*.cibntv.net", "+.ele.me", "*.elemecdn.com", "+.feizhu.com", "+.taopiaopiao.com", "+.fliggy.com",
                "+.koubei.com", "+.mybank.cn", "+.mmstat.com", "+.uczzd.cn", "+.iconfont.cn", "+.freshhema.com", "+.hemamax.com",
                "+.hemaos.com", "+.hemashare.cn", "+.shyhhema.com", "+.sm.cn", "+.npmmirror.com", "+.alios.cn", "+.wandoujia.com",
                "+.aligames.com", "+.25pp.com", "*.aliapp.org", "+.tanx.com", "+.hellobike.com", "*.hichina.com", "*.yunos.com",
                "*.nlark.com", "*.yuque.com", "upos-sz-mirrorali.bilivideo.com", "ali-safety-video.acfun.cn"
            ]
        },
        {
            dnsTarget: "https://doh.pub/dns-query",
            domains: [
                "doh.pub", "*.qcloud.com", "*.gtimg.cn", "*.gtimg.com", "*.gtimg.com.cn", "*.gdtimg.com", "*.idqqimg.com",
                "*.udqqimg.com", "*.igamecj.com", "+.myapp.com", "*.myqcloud.com", "+.dnspod.com", "*.qpic.cn", "*.qlogo.cn",
                "+.qq.com", "+.qq.com.cn", "*.qqmail.com", "+.qzone.com", "*.tencent-cloud.net", "*.tencent-cloud.com",
                "+.tencent.com", "+.tencent.com.cn", "+.tencentmusic.com", "+.weixinbridge.com", "+.weixin.com", "+.weiyun.com",
                "+.soso.com", "+.sogo.com", "+.sogou.com", "*.sogoucdn.com", "*.roblox.cn", "+.robloxdev.cn", "+.wegame.com",
                "+.wegame.com.cn", "+.wegameplus.com", "+.cdn-go.cn", "*.tencentcs.cn", "*.qcloudimg.com", "+.dnspod.cn",
                "+.anticheatexpert.com", "url.cn", "*.qlivecdn.com", "*.tcdnlive.com", "*.dnsv1.com", "*.smtcdns.net",
                "+.coding.net", "*.codehub.cn", "tx-safety-video.acfun.cn", "acg.tv", "b23.tv", "+.bilibili.cn", "+.bilibili.com",
                "*.acgvideo.com", "*.bilivideo.com", "*.bilivideo.cn", "*.bilivideo.net", "*.hdslb.com", "*.biliimg.com", "*.biliapi.com",
                "*.biliapi.net", "+.biligame.com", "*.biligame.net", "+.bilicomic.com", "+.bilicomics.com", "*.bilicdn1.com", "*.bulicdn2.com",
                "+.mi.com", "+.duokan.com", "*.mi-img.com", "*.mi-idc.com", "*.xiaoaisound.com", "*.xiaomixiaoai.com",
                "*.mi-fds.com", "*.mifile.cn", "*.mijia.tech", "+.miui.com", "+.xiaomi.com", "+.xiaomi.cn", "+.xiaomi.net",
                "+.xiaomiev.com", "+.xiaomiyoupin.com", "+.gorouter.info"
            ]
        },
        {
            dnsTarget: "180.184.2.2",
            domains: [
                "+.bytedance.com", "*.bytecdn.cn", "*.volccdn.com", "*.toutiaoimg.com", "*.toutiaoimg.cn", "*.toutiaostatic.com",
                "*.toutiaovod.com", "*.toutiaocloud.com", "+.toutiaopage.com", "+.feiliao.com", "+.iesdouyin.com", "*.pstatp.com",
                "+.snssdk.com", "*.bytegoofy.com", "+.toutiao.com", "+.feishu.cn", "+.feishu.net", "*.feishucdn.com", "*.feishupkg.com",
                "+.douyin.com", "*.douyinpic.com", "*.douyinstatic.com", "*.douyincdn.com", "*.douyinliving.com", "*.douyinvod.com",
                "+.huoshan.com", "*.huoshanstatic.com", "+.huoshanzhibo.com", "+.ixigua.com", "*.ixiguavideo.com", "*.ixgvideo.com",
                "*.byted-static.com", "+.volces.com", "+.baike.com", "*.zjcdn.com", "*.zijieapi.com", "+.feelgood.cn", "*.bytetcc.com",
                "*.bytednsdoc.com", "*.byteimg.com", "*.byteacctimg.com", "*.ibytedapm.com", "+.oceanengine.com", "*.edge-byted.com",
                "*.volcvideo.com", "*.bytecdntp.com", "upos-sz-mirrorbd.bilivideo.com", "upos-sz-mirrorbos.bilivideo.com"
            ]
        },
        {
            dnsTarget: "180.76.76.76",
            domains: [
                "+.91.com", "+.hao123.com", "+.baidu.cn", "+.baidu.com", "+.iqiyi.com", "*.iqiyipic.com", "*.baidubce.com",
                "*.bcelive.com", "*.baiducontent.com", "*.baidustatic.com", "*.bdstatic.com", "*.bdimg.com", "*.bcebos.com",
                "*.baidupcs.com", "*.baidubcr.com", "*.yunjiasu-cdn.net", "+.tieba.com", "+.xiaodutv.com", "*.shifen.com",
                "*.jomodns.com", "*.bdydns.com", "*.jomoxc.com", "*.duapp.com", "*.antpcdn.com"
            ]
        },
        {
            dnsTarget: "https://doh.360.cn/dns-query",
            domains: [
                "*.qhimg.com", "*.qhimgs.com", "*.qhres.com", "*.qhres2.com", "*.qhmsg.com", "*.qhstatic.com", "*.qhupdate.com",
                "*.qihucdn.com", "+.360.com", "+.360.cn", "+.360.net", "+.360safe.com", "*.360tpcdn.com", "+.360os.com",
                "*.360webcache.com", "+.360kuai.com", "+.so.com", "+.haosou.com", "+.yunpan.cn", "+.yunpan.com", "+.yunpan.com.cn",
                "*.qh-cdn.com", "+.baomitu.com", "+.qiku.com"
            ]
        },
        {
            dnsTarget: "system",
            domains: [
                "+.securelogin.com.cn", "captive.apple.com", "hotspot.cslwifi.com", "*.m2m", "injections.adguard.org",
                "local.adguard.org", "*.bogon", "*.home", "instant.arubanetworks.com", "setmeup.arubanetworks.com",
                "router.asus.com", "repeater.asus.com", "+.asusrouter.com", "+.routerlogin.net", "+.routerlogin.com", "+.tplinkwifi.net",
                "+.tplink.cn", "+.tplinkap.net", "+.tplinkmodem.net", "+.tplinkplclogin.net", "+.tplinkrepeater.net", "*.ui.direct",
                "unifi", "*.huaweimobilewifi.com", "*.router", "aterm.me", "console.gl-inet.com", "homerouter.cpe", "mobile.hotspot",
                "ntt.setup", "pi.hole", "*.plex.direct", "+.10.in-addr.arpa", "+.16.172.in-addr.arpa", "+.17.172.in-addr.arpa",
                "+.18.172.in-addr.arpa", "+.19.172.in-addr.arpa", "+.20.172.in-addr.arpa", "+.21.172.in-addr.arpa", "+.22.172.in-addr.arpa",
                "+.23.172.in-addr.arpa", "+.24.172.in-addr.arpa", "+.25.172.in-addr.arpa", "+.26.172.in-addr.arpa", "+.27.172.in-addr.arpa",
                "+.28.172.in-addr.arpa", "+.29.172.in-addr.arpa", "+.30.172.in-addr.arpa", "+.31.172.in-addr.arpa", "+.168.192.in-addr.arpa",
                "+.254.169.in-addr.arpa", "*.lan", "*.local", "*.internal", "*.localdomain", "+.home.arpa"
            ]
        }
    ];
    const nameserverPolicy = {};
    policyGroups.forEach(({ dnsTarget, domains }) => {
        domains.forEach(d => nameserverPolicy[d] = dnsTarget);
    });
    params.dns["nameserver-policy"] = nameserverPolicy;
}

function overwriteHosts(params) {
    params.hosts = {
        "dns.alidns.com": ['223.5.5.5', '223.6.6.6', '2400:3200:baba::1', '2400:3200::1'],
        "doh.pub": ['120.53.53.53', '1.12.12.12'],
        "cdn.jsdelivr.net": "cdn.jsdelivr.net.cdn.cloudflare.net"
    };
}

function overwriteTunnel(params) {
    params.tun = {
        enable: true,
        stack: "mixed",
        device: "TUN",
        "dns-hijack": ["any:53"],
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": false,
        "route-exclude-address": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "100.64.0.0/10"]
    };
}

function overwriteProxyGroups(params) {
    const allProxies = params.proxies.map(e => e.name);
    const regionList = [
        {
            flag: "🇭🇰", name: "香港", keyword: "香港|HK|Hong|🇭🇰", isMain: true,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/HKflag.png"
        },
        {
            flag: "🇨🇳", name: "台湾", keyword: "台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳", isMain: true,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/TWflag.png"
        },
        {
            flag: "🇸🇬", name: "狮城", keyword: "新加坡|狮城|SG|Singapore|🇸🇬", isMain: true,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/SGflag.png"
        },
        {
            flag: "🇯🇵", name: "日本", keyword: "日本|JP|Japan|🇯🇵", isMain: true,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/JPflag.png"
        },
        {
            flag: "🇺🇸", name: "美国", keyword: "美国|US|United States|America|🇺🇸", isMain: true,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/USflag.png"
        },
        {
            flag: "🇰🇷", name: "韩国", keyword: "韩国|韓|KR|Korea|🇰🇷", isMain: false,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/KRflag.png"
        },
        {
            flag: "🇬🇧", name: "英国", keyword: "英国|UK|United Kingdom|🇬🇧", isMain: false,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/UKflag.png"
        },
        {
            flag: "🇫🇷", name: "法国", keyword: "法国|FR|France|🇫🇷", isMain: false,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/FRflag.png"
        },
        {
            flag: "🇩🇪", name: "德国", keyword: "德国|DE|Germany|🇩🇪", isMain: false,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/DEflag.png"
        },
        {
            flag: "", name: "低倍率", keyword: "(?:^|[^0-9])0\\.[1-9](?:$|[^0-9])", isMain: false,
            icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/0.x.png"
        }
    ];

    const autoGroups = [];
    const manualGroups = [];
    const groupedNodeSet = new Set();
    const validAutoNames = new Set();

    regionList.forEach(item => {
        // 匹配当前地区所有节点
        const reg = new RegExp(`^(?=.*${item.keyword})(?!.*${EXCLUDE_KEYWORDS_PATTERN}).*$`, "i");
        const matchNodes = getProxiesByRegex(params, reg, false);
        if (matchNodes.length === 0) return;

        const autoName = `${item.flag} ${item.name}-自动`.trim();
        validAutoNames.add(autoName);
        groupedNodeSet.add(...matchNodes);

        autoGroups.push({
            name: autoName,
            type: "url-test",
            url: "https://cp.cloudflare.com/generate_204",
            interval: 900,
            tolerance: 50,
            lazy: !item.isMain,
            hidden: true,
            proxies: matchNodes
        });

        manualGroups.push({
            name: `${item.flag} ${item.name}节点`.trim(),
            type: "select",
            icon: item.icon,
            proxies: [autoName, ...matchNodes]
        });
    });

    const remainNodes = allProxies.filter(n => !groupedNodeSet.has(n));
    const regionGroupNames = manualGroups.map(g => g.name);

    const mainProxyGroup = {
        name: "Proxy",
        type: "select",
        icon: "https://cdn.jsdelivr.net/gh/Alex-spaceship/icons_0@main/Proxy.png",
        proxies: [...regionGroupNames, "DIRECT", ...remainNodes]
    };

    params["proxy-groups"] = [mainProxyGroup, ...autoGroups, ...manualGroups];
}

function overwriteRules(params) {
    const customDirect = [
        "DOMAIN-SUFFIX,weixin.qq.com,DIRECT",
        "DOMAIN-SUFFIX,wechat.com,DIRECT",
        "DOMAIN-KEYWORD,weixin,DIRECT"
    ];
    const rejectRules = [
        "RULE-SET,reject_non_ip,REJECT",
        "RULE-SET,reject_domainset,REJECT",
        "RULE-SET,reject_non_ip_drop,REJECT-DROP",
        "RULE-SET,reject_non_ip_no_drop,REJECT",
        "RULE-SET,reject_ip,REJECT"
    ];
    const lanDirect = [
        "RULE-SET,lan_non_ip,DIRECT",
        "RULE-SET,lan_ip,DIRECT"
    ];
    const domesticDirect = [
        "RULE-SET,domestic_non_ip,DIRECT",
        "RULE-SET,direct_non_ip,DIRECT",
        "RULE-SET,china_ip,DIRECT",
        "RULE-SET,domestic_ip,DIRECT"
    ];
    const finalMatch = ["MATCH,Proxy"];

    params.rules = [
        ...customDirect,
        ...rejectRules,
        ...lanDirect,
        ...domesticDirect,
        ...finalMatch
    ];

    const baseProvider = { type: "http", interval: 43200, proxy: "Proxy" };
    const providerList = [
        {key:"reject_non_ip_no_drop",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/non_ip/reject-no-drop.txt",path:"./rule_set/sukkaw_ruleset/reject_non_ip_no_drop.txt"},
        {key:"reject_non_ip_drop",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/non_ip/reject-drop.txt",path:"./rule_set/sukkaw_ruleset/reject_non_ip_drop.txt"},
        {key:"reject_non_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/non_ip/reject.txt",path:"./rule_set/sukkaw_ruleset/reject_non_ip.txt"},
        {key:"reject_domainset",behavior:"domain",format:"text",url:"https://ruleset.skk.moe/Clash/domainset/reject.txt",path:"./rule_set/sukkaw_ruleset/reject_domainset.txt"},
        {key:"reject_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/ip/reject.txt",path:"./rule_set/sukkaw_ruleset/reject_ip.txt"},
        {key:"lan_non_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/non_ip/lan.txt",path:"./rule_set/sukkaw_ruleset/lan_non_ip.txt"},
        {key:"lan_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/ip/lan.txt",path:"./rule_set/sukkaw_ruleset/lan_ip.txt"},
        {key:"domestic_non_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/non_ip/domestic.txt",path:"./rule_set/sukkaw_ruleset/domestic_non_ip.txt"},
        {key:"direct_non_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/non_ip/direct.txt",path:"./rule_set/sukkaw_ruleset/direct_non_ip.txt"},
        {key:"china_ip",behavior:"ipcidr",format:"text",url:"https://ruleset.skk.moe/Clash/ip/china_ip.txt",path:"./rule_set/sukkaw_ruleset/china_ip.txt"},
        {key:"domestic_ip",behavior:"classical",format:"text",url:"https://ruleset.skk.moe/Clash/ip/domestic.txt",path:"./rule_set/sukkaw_ruleset/domestic_ip.txt"}
    ];
    params["rule-providers"] = Object.fromEntries(
        providerList.map(p => [p.key, { ...baseProvider, behavior:p.behavior, format:p.format, url:p.url, path:p.path }])
    );
}

function getProxiesByRegex(params, regex, fallbackToDirect = true) {
    const matched = params.proxies.filter(e => regex.test(e.name)).map(e => e.name);
    return matched.length ? matched : (fallbackToDirect ? ["DIRECT"] : []);
}
