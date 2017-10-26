## 定格动画部分接口

### 一. 获取音频资源

#### 方式一

url:

http://39.108.158.131/api/v1/audios

参数：

| 参数 | 是否必须 | 默认值 | 解释 |
| ---- | ---- | ---- | ---- |
| all | 否 | 0 | 1显示全部，非1则不是 |
| page | 否 | 1 | 第几页 |
| per | 否 | 20 | 每页数量 |


返回值（成功）：

```json
{
  "Code": 200,
  "Msg": "成功",
  "Data" :{
    "Data":[
      {
      "Id":3,
      "Title":"慕容毓像.mp3",
      "Url":"http://oqdy6yqkp.bkt.clouddn.com/lo0fp8H8cDG0P7bncvDDjtdYKrIB",
      "SortBy":3,
      "CreateAt":"2017-06-27T17:48:35+08:00",
      "UpdateAt":"2017-06-27T17:48:35+08:00",
      "Version":1,
      "Size":"6632453"
      },
      {
        "Id":1,
        "Title":"测试音频素材",
        "Url":"http://oqdy6yqkp.bkt.clouddn.com/lo0fp8H8cDG0P7bncvDDjtdYKrIB",
        "SortBy":2,"CreateAt":"2017-06-27T14:42:50+08:00",
        "UpdateAt":"2017-06-27T14:42:50+08:00",
        "Version":1,
        "Size":"6632453"
      },
      {
        "Id":2,
        "Title":"测试音频2",
        "Url":"http://oqdy6yqkp.bkt.clouddn.com/luoSv3OHto8gDQJxtde86YRBwOsF",
        "SortBy":1,
        "CreateAt":"2017-06-27T14:46:48+08:00",
        "UpdateAt":"2017-06-27T14:46:48+08:00",
        "Version":1,
        "Size":"6992130"
      }
    ],
  "Counts":3
  }
}

```

返回值：（失败）， Code 不为 200的均为失败，比如：

```json
{
  "Code": 403,
  "Msg": "权限不足",
  "Data": null
}

```

#### 方式二

url:

http://39.108.158.131/api/v1/audios_o

参数：

| 参数 | 是否必须 | 默认值 | 解释 |
| ---- | ----| ---- | ---- |
| all | 否 | 0 | 1表示获取全部，非1则不是 |
| left_all | 否 | 0 | 1表示获取剩下全部,非1则不是 |
| direction | 否 | 0 | 方向0向下获取,其他向上获取（0获取下一页，-1获取上一页） |
| last_sort_by | 否 | 0 | 上一页的最后一个排序的号 |
| per | 否 | 20 | 每页获取的数目 |

返回值（成功）：
同上

返回值（失败）：
同上


--------

### 二. 获取背景(贴图)

url:

http://39.108.158.131/api/v1/backgrounds

参数：

| 参数 | 是否必须 | 默认值 | 解释 |
| ---- | ---- | ---- | ---- |
| data_type| 否 | 0 | 1获取贴图素材，0获取背景素材|
| all | 否 | 0 | 1显示全部，非1则不是 |
| page | 否 | 1 | 第几页 |
| per | 否 | 20 | 每页数量 |

返回值（成功）：

```json
{
  "Code":200,
  "Msg":"成功",
  "Data":{
    "Data":[
      {
        "Id":113,
        "Title":"music-file.png",
        "Thumb_url":"",
        "Url":"http://oqdy6yqkp.bkt.clouddn.com/Fn3xAl4ykwab55h2AzwUWFXgExw-",
        "SortBy":3,
        "CreateAt":"2017-07-01T16:17:42+08:00",
        "UpdateAt":"2017-07-01T16:17:42+08:00",
        "Size":"22973",
        "Version":1,
        "DType":0
        },
        {
          "Id":108,
          "Title":"310045918.jpg",
          "Thumb_url":"",
          "Url":"http://oqdy6yqkp.bkt.clouddn.com/FsxTygo4Ax4ei6IGB9zDFaMXRNJp",
          "SortBy":2,
          "CreateAt":"2017-06-14T18:16:24+08:00",
          "UpdateAt":"2017-06-14T18:16:24+08:00",
          "Size":"2784202","Version":1,
          "DType":0
        }
    ],
    "Counts":3
  }
}
```

返回值：（失败）， Code 不为 200的均为失败，比如：

```json
{
  "Code": 403,
  "Msg": "权限不足",
  "Data": null
}
```


#### 方式二

url:

http://39.108.158.131/api/v1/backgrounds

参数：

| 参数 | 是否必须 | 默认值 | 解释 |
| ---- | ----| ---- | ---- |
| data_type| 否 | 0 | 1获取贴图素材，0获取背景素材|
| all | 否 | 0 | 1表示获取全部，非1则不是 |
| left_all | 否 | 0 | 1表示获取剩下全部,非1则不是 |
| direction | 否 | 0 | 方向0向下获取,其他向上获取（0获取下一页，-1获取上一页） |
| last_sort_by | 否 | 0 | 上一页的最后一个排序的号 |
| per | 否 | 20 | 每页获取的数目 |

返回值（成功）：
同上

返回值（失败）：
同上
