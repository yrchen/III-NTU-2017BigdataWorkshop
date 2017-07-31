# -*- coding: utf-8 -*-

# 
# yrchen.170731: 修改自
# https://gist.github.com/jwlin/b8d7819cf538697ac91e715e9260f566
#

from bs4 import BeautifulSoup

html_doc = """
<html>
  <head>
    <title>我是網頁標題</title>
	<style>
	.large {
	  color:blue;
	  text-align: center;
	}
	</style>
  </head>
  <body>
    <h1 class="large">我是變色且置中的抬頭</h1>
    <p id="p1">我是段落一</p>
	<p id="p2" style="">我是段落二</p>
	<div><a href='http://blog.castman.net' style="font-size:200%;">我是放大的超連結</a></div>
  </body>
</html>
"""

soup = BeautifulSoup(html_doc, 'html.parser')
print(soup)
# <html>
# <head>
# <title>我是網頁標題</title>
# <style>
# .large {
#   color:blue;
#   text-align: center;
# }
# </style>
# </head>
# <body>
# <h1 class="large" style="">我是變色且置中的抬頭</h1>
# <p id="p1">我是段落一</p>
# <p id="p2" style="">我是段落二</p>
# <div><a href="http://blog.castman.net" style="font-size:200%;">我是放大的超連結</a></div>
# </body>
# </html>

soup.find('p')            # 回傳第一個被 <p> </p> 所包圍的區塊
# <p id="p1">我是段落一</p>

soup.find('p', id='p2')   # 回傳第一個被 <p> </p> 所包圍的區塊且 id="p2"
# <p id="p2" style="">我是段落二</p>

soup.find(id='p2')        # 回傳第一個 id="p2" 的區塊
# <p id="p2" style="">我是段落二</p>

soup.find_all('p')        # 回傳所有被 <p> </p> 所包圍的區塊
# [<p id="p1">我是段落一</p>, <p id="p2" style="">我是段落二</p>]

soup.find('h1', 'large')  # 找尋第一個 <h1> 區塊且 class="large"
# <h1 class="large" style="">我是變色且置中的抬頭</h1>

paragraphs = soup.find_all('p')
for p in paragraphs:
    print(p['id'], p.text)
# p1 我是段落一
# p2 我是段落二

a = soup.find('a')
print(a['href'], a['style'], a.text)
# http://blog.castman.net font-size:200%; 我是放大的超連結

print(soup.find('h1')['class'])  # 因為 class 可以有多個值，故回傳 list
# ['large']

print(soup.find(id='p1').get('style'))  # None
