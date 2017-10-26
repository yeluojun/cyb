package configs

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"reflect"
	"sync"

	"github.com/go-xorm/xorm"
	"github.com/gorilla/sessions"
	"github.com/sirupsen/logrus"
)

// 全局的数据库实例
var Engine *xorm.Engine
var Store *sessions.CookieStore
var GlobalLog *logrus.Logger
var ConfigFile *Config
var GlobalRedis *Redis

// var WriteLogChan chan int = make(chan int, 10)

// 全局常量
const (
	DB_DEVELOPMENT = "root:123456@/dg_development?charset=utf8"
	DB_TEST        = "root:123456@/dg_test?charset=utf8"
	// DB_PRODUCTION  = "root:123456@/dg_production?charset=utf8"
)

// the struct  return to client
type RetData struct {
	Code int
	Msg  string
	Data interface{}
}

func init() {
	Store = sessions.NewCookieStore([]byte("cyb-session-id"))
	GlobalLog = logrus.New()
	ConfigFile = new(Config)
}

// http write json
func ReturnJson(w http.ResponseWriter, code int, msg string, data interface{}) bool {
	ret := RetData{
		Code: code,
		Msg:  msg,
		Data: data,
	}

	js, err := json.Marshal(ret)

	// json error
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return false
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(js)

	return true
}

func RetText(w http.ResponseWriter, text string) {
	w.Header().Set("Content-type", "application/text; charset=utf-8")
	w.Write([]byte(text))
}

// interface 类型转 []interface
func ToSlice(arr interface{}) []interface{} {
	v := reflect.ValueOf(arr)
	if v.Kind() != reflect.Slice {
		panic("toslice arr not slice")
	}
	l := v.Len()
	ret := make([]interface{}, l)
	for i := 0; i < l; i++ {
		ret[i] = v.Index(i).Interface()
	}
	return ret
}

// 获取数据库配置的字符串
func GetDbConfStr() string {
	// 初始化读取配置文件 TODO 重构用context
	myConfig := new(Config)
	myConfig.InitConfig("./configs/dbconfig")
	appmodel := myConfig.Read("model", "appmodel")
	if appmodel != "production" && appmodel != "development" && appmodel != "test" {
		appmodel = "development"
	}
	s := myConfig.Read(appmodel, "dbuser") + ":" + myConfig.Read(appmodel, "dbpwd") + "@/" + myConfig.Read(appmodel, "dbname") + "?charset=utf8"
	fmt.Println(s)
	return s
}

// 日志写入
func WriteLog(level string, content interface{}) {

	go func() {
		var wlock sync.RWMutex
		wlock.Lock()
		defer wlock.Unlock()

		file, err := os.OpenFile("./log/dgapp.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)

		if err != nil {
			fmt.Println("打开文件异常：", err)
			fmt.Println("原始信息：", content)
			return
		}

		// defer file.Close()

		GlobalLog.Out = file

		switch level {
		case "error":
			GlobalLog.Error(content)
		case "warn":
			GlobalLog.Warn(content)
		default:
			GlobalLog.Info(content)
		}
	}()

	// 解析json文件
}

func ReadConfigFile(path string) {
	ConfigFile.InitConfig(path)
}

// json 解析
