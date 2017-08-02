# -*- coding: utf-8 -*-
from __future__ import absolute_import

#
# yrchen: 170729: 修改自
# https://github.com/jlee58/IDCC_HW4/blob/master/python/getBike.py
#

import gzip
import json
import sys

import urllib

# YouBike臺北市公共自行車即時資訊
# http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48
url = "http://data.taipei/youbike"

# 透過 urllib 下載 YouBike 資料
print "Downloading YouBike Opendata with urllib..."
urllib.urlretrieve(url, "data.gz")

print "Unziping data..."
f = gzip.open('data.gz', 'r')
jdata = f.read()
f.close()
data = json.loads(jdata)

# 取出並顯示資料
for value in data["retVal"].itervalues():
    # sno：站點代號
    sno = value["sno"]
    # sna：場站名稱(中文)
    sna = value["sna"]
    # tot：場站總停車格
    tot = value["tot"]
    # sbi：場站目前車輛數量
    sbi = value["sbi"]
    # sarea：場站區域(中文)
    sarea = value["sarea"]
    # mday：資料更新時間
    mday = value["mday"]
    # lat：緯度
    lat = value["lat"]
    # lng：經度
    lng = value["lng"]
    # ar：地(中文)
    ar = value["ar"]
    # sareaen：場站區域(英文)
    sareaen = value["sareaen"]
    # snaen：場站名稱(英文)
    snaen = value["snaen"]
    # aren：地址(英文)
    aren = value["aren"]
    # bemp：空位數量
    bemp = value["bemp"]
    # act：全站禁用狀態
    act = value["act"]

    print "NO." + sno + " " + sna
