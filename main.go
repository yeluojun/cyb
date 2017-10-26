package main

import (
	"cyb/configs"
	"cyb/models"
	"cyb/routers"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
)

// 初始化一些东西
func init() {
	go configs.ReadConfigFile("./configs/dbconfig")
	if !initDb() {
		panic("db error")
	}
	configs.GlobalRedis = new(configs.Redis)
	configs.GlobalRedis.Init()
}

// 初始化数据库
func initDb() bool {
	var err error
	configs.Engine, err = xorm.NewEngine("mysql", configs.GetDbConfStr())
	if err != nil {
		// panic(err.Error())
		configs.WriteLog("error", "数据库连接失败: main.go, line: 35")
		return false
	}

	// 同步表
	err = configs.Engine.Sync2(new(models.User))
	if err != nil {
		configs.WriteLog("error", "更新数据库失败：file: main.go")
		return false
	}
	return true
}

func main() {
	routers.ServerInit()
}
