# -*- coding: utf-8 -*-

# yrchen.170730: 修改自
# https://gist.github.com/bryanyang0528/bc483a24b443f4ad914c
# http://blog.bryanbigdata.com/2014/12/python-crawler_29.html
#

# 匯入所需的套件
from random import randint
import time
import sys

from bs4 import BeautifulSoup
import HTMLParser
from IPython.display import clear_output
import requests

# 定義最多抓取幾頁的資訊
MAX_PAGE = 2

# 定義是否要休息一下
SLEEP = False

# 從搜尋頁面擷取店家網址
links = ['http://www.ipeen.com.tw/search/all/000/1-100-0-0/?p=' + str(i+1) + '&adkw=台大' for i in range(MAX_PAGE)]
shop_links = []

# 產生店家資訊列表
for i, link in enumerate(links):
    print "Parsing Search Page %s " % (str(i + 1))
    res = requests.get(link)
    soup = BeautifulSoup(res.text.encode("utf-8"), 'lxml')
    shop_table = soup.findAll(
        'h3', {
            'class': 'name'
        }
    )
    ##關在a tag裡的網址抓出來
    for shop_link in shop_table:
        link = 'http://www.ipeen.com.tw' + [tag['href'] for tag in shop_link.findAll('a', {'href': True})][0]
        shop_links.append(link)

        # 避免被擋掉，小睡一會兒
        if SLEEP:
            print "Sleeping... zZZ"
            time.sleep(1)

##建立變項檔案的header
title  = "shop" + "," + "category" + "," + "tel" + "," + "addr" + "," + "cost" + "," + "rank" + "," + "ratingCount" + "," + "share" + "," + "collect"
shop_list = open('shop_list.txt','w')
##先把header寫進去
shop_list.write(title.encode('utf-8') + "\n")

# 依序存取個別店家資訊頁面
for i in range(len(shop_links)):
    print "Analysing Shop No. %s" % (str(i + 1))
    res = requests.get(shop_links[i])
    soup = BeautifulSoup(res.text.encode("utf-8"), 'lxml')

    # 取出店家全部資訊
    header = soup.find(
        'div', {
            'class': 'info'
        }
    )

    # 取出店家名稱資訊，內容範例如下：
    # <h1>
	#   <span itemprop="name">大龍家風味蛋糕店</span>
    # </h1>
    shop = header.find(
        'span', {
            'itemprop': 'name'
        }
    ).string.strip()

    # 取出店家其他資訊，考慮有可能資料為空，需要加上例外處理

    # 取出店家分類資訊，內容範例如下：
    # <p class="cate i">
    #   <a href="/search/taichung/000/1-0-7-10/" class="ga_tracking"
    #      data-category="WEB_shop" data-action="up_small_classify" data-label="上方小分類">休閒零食</a>
    # </p>
    #
    try:
        category = header.find(
            'p', {
                'class': 'cate i'
            }
        ).a.string
    except Exception as e:
        category = ""

    # 取出店家電話資訊，內容範例如下：
    # <p class="tel i">
    #   <a href="tel:04-2487-0880" class="ga_tracking"
    #      data-category="WEB_shop" data-action="up_phone" data-label="上方電話">04-2487-0880</a>
    #   <meta itemprop="telephone" content="04-2487-0880">
    # </p>
    try:
        tel = header.find(
            'p', {
                'class': 'tel i'
            }
        ).a.string.replace("-", "")
    except Exception as e:
        tel = ""

    # 取出店家地址資訊，內容範例如下：
    # <p class="addr i">
    #   <a target="_blank"
    #      href="/map/#!/s=0/f=0|0|0|0|0|10|0|0|0/c=24.10414870885,120.6834361081/z=18/sid=623212/"
    #      class="ga_tracking" data-category="WEB_shop" data-action="up_address"
    #      data-label="上方地址">台中市大里區國光里德芳南路436號1樓</a>
    # </p>
    try:
        addr = header.find(
            'p', {
                'class': 'addr i'
            }
        ).a.string.strip()
    except Exception as e:
        addr = ""

    # 取出店家價格資訊，內容範例如下：
    # <p class="cost i">
    #  本店均消  208 元
    # </p>
    try:
        cost = header.find(
            'p', {
                'class': 'cost i'
            }
        ).string.split()[1] # 由於取出的資料會是 '本店均消' '金額' '元' 的格式，所以需要切割字串再取金額
    except Exception as e:
        cost = ""

    # 取出店家平均評分，內容範例如下
    # <meter value="45" min="0" max="50">
    #   <span itemprop="ratingValue">45</span>
    #    /
    #   <span itemprop="bestRating">50</span>
    # </meter>
    try:
        rank = header.find(
            'span', {
                'itemprop': 'ratingValue'
            }
        ).string.strip()
    except Exception as e:
        rank = ""

    # 取出店家評分人數，內容範例如下
    # <em itemprop="ratingCount">40</em>
    try:
        ratingCount = header.find(
            'em', {
                'itemprop': 'ratingCount'
            }
        ).string.strip()
    except Exception as e:
        ratingCount = ""

    # 取出店家瀏覽人數
    try:
        share = header.find_all('em')[1].string.replace(',','')
    except Exception as e:
        share = ""

    # 取出店家收藏人數
    try:
        collect = header.find_all('em')[2].string.replace(',','')
    except Exception as e:
        collect = ""

    ##串起來用逗號分格（應該有更好的方法，但是先將就用用）
    result = shop + "," + category + "," + tel + "," + addr + "," + cost + "," + rank + "," + ratingCount + "," + share + "," + collect
    shop_list.write(result.encode('utf-8') + "\n")

    # 隨機睡一下
    if SLEEP:
        print "Sleeping... "
        time.sleep(randint(1, 5))

    clear_output()
    sys.stdout.flush()

shop_list.close()
print "Goodbye~"
