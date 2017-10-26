package configs

import (
	"time"

	"github.com/go-redis/redis"
)

type Redis struct {
	client *redis.Client
}

func (r *Redis) Init() {
	r.client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		DB:   10, // use default DB
	})
}
func (r *Redis) Set(key string, value interface{}, expiration time.Duration) *redis.StatusCmd {
	return r.client.Set("cyb:"+key, value, expiration)
}

func (r *Redis) Get(key string) *redis.StringCmd {
	return r.client.Get("cyb:" + key)
}

func (r *Redis) Del(key string) *redis.IntCmd {
	return r.client.Del("cyb:" + key)
}

func (r *Redis) Expire(key string, expiration time.Duration) *redis.BoolCmd {
	return r.client.Expire("cyb:"+key, expiration)
}
