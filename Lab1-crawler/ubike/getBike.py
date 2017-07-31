#!/usr/bin/env python
import urllib
import gzip
import json
#from pprint import pprint
url = "http://data.taipei/youbike"
print "downloading with urllib"
urllib.urlretrieve(url, "data.gz")
f = gzip.open('data.gz', 'r')
jdata = f.read()
f.close()
data = json.loads(jdata)
for key,value in data["retVal"].iteritems():
        sno = value["sno"]
        sna = value["sna"]
        tot = value["tot"]
        sbi = value["sbi"]
        sarea = value["sarea"]
        mday = value["mday"]
        lat = value["lat"]
        lng = value["lng"]
        ar = value["ar"]
        sareaen = value["sareaen"]
        snaen = value["snaen"]
        aren = value["aren"]
        bemp = value["bemp"]
        act = value["act"]
        print "NO." + sno + " " + sna
