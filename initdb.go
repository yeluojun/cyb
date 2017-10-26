package main

//
// import (
// 	"fmt"
// 	"strconv"
//
// 	"./configs"
// 	"./models"
// 	_ "github.com/go-sql-driver/mysql"
// 	"github.com/go-xorm/xorm"
// )
//
// func main() {
//
// }
//
// func init() {
// 	var err error
//
// 	// 连接数据库
// 	configs.Engine, err = xorm.NewEngine("mysql", configs.DB_DEVELOPMENT)
// 	if err != nil {
// 		panic(err.Error())
// 	}
//
// 	// 初始化数据 // 初始化 audio
// 	var audios []models.Audio
//
// 	for i := 0; i < 20; i++ {
// 		audio := models.Audio{Title: "我是测试数据_" + strconv.Itoa(i), Url: "http://baidu.com", SortBy: int64(i)}
// 		audios = append(audios, audio)
// 	}
// 	if _, err = configs.Engine.Insert(&audios); err != nil {
// 		fmt.Println(err)
// 	}
// }
