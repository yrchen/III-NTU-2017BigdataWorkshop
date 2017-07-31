#
# https://gist.github.com/bryanyang0528/bc483a24b443f4ad914c
# http://blog.bryanbigdata.com/2014/12/python-crawler_29.html
#

##import 必要套件
import requests
from bs4 import BeautifulSoup
import HTMLParser
import time
from random import randint
import sys
from IPython.display import clear_output

##從搜尋頁面擷取店家網址（因為搜尋頁面的電話是圖片不好抓）
links = ['http://www.ipeen.com.tw/search/all/000/1-100-0-0/?p=' + str(i+1) + 'adkw=東區&so=commno' for i in range(10)]
shop_links=[]
for link in links:
    res = requests.get(link)
    soup = BeautifulSoup(res.text.encode("utf-8"))
    shop_table = soup.findAll('h3',{'class':'name'})
    ##關在a tag裡的網址抓出來
    for shop_link in shop_table:
        link = 'http://www.ipeen.com.tw' + [tag['href'] for tag in shop_link.findAll('a',{'href':True})][0]
        shop_links.append(link)
    ##避免被擋掉，小睡一會兒
    time.sleep(1)

##建立變項檔案的header
title  = "shop" + "," + "category" + "," + "tel" + "," + "addr" + "," + "cost" + "," + "rank" + "," + "counts" + "," + "share" + "," + "collect"
shop_list = open('shop_list.txt','w')
##先把header寫進去
shop_list.write(title.encode('utf-8') + "\n")

for i in range(len(shop_links)):

    res = requests.get(shop_links[i])
    soup = BeautifulSoup(res.text.encode("utf-8"))
    header = soup.find('div',{'class':'info'})

    shop = header.h1.string.strip()

    ##做例外處理
    try:
        category = header.find('p', {'class':'cate i'}).a.string
    except Exception as e:
        category = ""

    try:
        tel = header.find('p',{'class': 'tel i'}).a.string.replace("-","")
    except Exception as e:
        tel = ""

    try:
        addr = header.find('p', {'class': 'addr i'}).a.string.strip()
    except Exception as e:
        addr = ""

    try:
        cost = header.find('p', {'class':'cost i'}).string.split()[1]
    except Exception as e:
        cost = ""

    try:
        rank = header.find('span', {'itemprop': 'average'}).string
    except Exception as e:
        rank = ""

    try:
        counts = header.find_all('em')[0].string.replace(',','')
    except Exception as e:
        counts = ""

    try:
        share = header.find_all('em')[1].string.replace(',','')
    except Exception as e:
        share = ""

    try:
        collect = header.find_all('em')[2].string.replace(',','')
    except Exception as e:
        collect = ""

    ##串起來用逗號分格（應該有更好的方法，但是先將就用用）
    result = shop + "," + category + "," + tel + "," + addr + "," + cost + "," + rank + "," + counts + "," + share + "," + collect
    shop_list.write(result.encode('utf-8') + "\n")

    ##隨機睡一下
    time.sleep(randint(1,5))
    clear_output()
    print i
    sys.stdout.flush()

shop_list.close()
