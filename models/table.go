package models

import "time"

// 用户表
type User struct {
	Id        int64 `xorm:"index"`
	Nickname  string
	Avatar    string
	WxOpenId  string
	Status    int `xorm:"default 0"` // 0代表可用,1代表不可用
	Role      int `xorm:"default 0"` // 0代表普通用户，1代表管理员
	Phone     string
	Password  string
	Qr        string
	Car       string
	CreatedAt time.Time `xorm:"created"`
	UpdatedAt time.Time `xorm:"updated"`
	Version   int       `xorm:"version"` // 乐观锁
}
