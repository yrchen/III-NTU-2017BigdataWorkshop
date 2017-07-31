#
# yrchen.170729: 
# 修改自 https://github.com/kdchang/python101/blob/master/Unit12/examples/OpenData/land.py
#

import pandas as pd

res = pd.read_csv('./20170501-opendata/A_LVR_LAND_C.CSV', encoding='big5')

print(res.describe())
print(res.mean())

with open('./statistic.csv', 'w') as f:
	f.write(res.describe().to_csv())
