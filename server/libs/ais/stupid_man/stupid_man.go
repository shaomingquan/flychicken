package fc_stupid

import (
	player "flychicken/server/libs/ais/player"
	"flychicken/server/libs/messagescheme"
	"math/rand"
	"strconv"
	"time"

	"github.com/sadlil/go-trigger"
)

// golang 无法循环引用
type Stupid struct {
	Id        int
	Hp        int
	Birthposi map[string]int
	Metrics   map[string]bool
	Target    map[string]int
	Dieing    chan string    // 阻塞，等待go hanging结束
	Posi      map[string]int // 不必过于精确，n个player的前端都会不定时的同步这个消息，只用来计算距离哪个玩家最近
}

var acces = []string{"accX", "accY", "acc_X", "acc_Y"}

func (s *Stupid) Hanging(players map[string]player.Player) {
	sendMessage := func(binary []byte) {
		for pid, _ := range players {
			trigger.Fire("message-"+pid, binary)
		}
	}
	// 机器人诞生 // 机器人诞生的时候还没有玩家，所以这个事件没必要，还有一点是当没有玩家的时候，timer不用trigger
	// m := mscheme.Message{
	// 	Category: "enemy:" + string(s.Id),
	// 	Action:   "action:birth",
	// 	Data:     s.arrfyposiData()}
	// jsonstr := mscheme.Jsonstringify(&m)
	// sendMessage(jsonstr)

	interval := rand.Intn(400) + 1000
	ticker := time.NewTicker(time.Millisecond * time.Duration(interval))
	go func() {
		counter := 0
		for range ticker.C {
			counter++
			for _, attr := range acces {
				s.Metrics[attr] = false
			}
			s.Metrics[acces[counter%4]] = true
			m := mscheme.Message{
				Category: "enemy:" + strconv.Itoa(s.Id),
				Action:   "action:hanging",
				Data:     s.arrfyhangingData()}
			jsonstr := mscheme.Jsonstringify(&m)
			sendMessage(jsonstr) // 机器人改变他的加速度

			if s.Hp <= 0 {
				m := mscheme.Message{
					Category: "enemy:" + string(s.Id),
					Action:   "action:dead",
					Data:     []int{0}}
				jsonstr := mscheme.Jsonstringify(&m)
				sendMessage(jsonstr) // 机器人已经跪了，此时前端将它移除
				s.Dieing <- "XXX"
			}
		}
	}()

	<-s.Dieing
	ticker.Stop()

}

func (s *Stupid) arrfyhangingData() []int {
	ret := []int{}
	for _, attr := range acces {
		print(attr)
		println(s.Metrics[attr])
		if s.Metrics[attr] == true {
			ret = append(ret, 1)
		} else {
			ret = append(ret, 0)
		}
	}
	ret = append(ret, s.Birthposi["x"], s.Birthposi["y"]) // 这里用来校验位置，叫birthposi就不恰当了
	return ret
}

func (s *Stupid) arrfyposiData() []int {
	ret := []int{}
	ret = append(ret, s.Posi["x"], s.Posi["y"])
	return ret
}

func (s *Stupid) findNearestEnemy(es *map[int]player.Player) player.Player {
	minDistance := 100000000
	ret := player.Player{}
	sPosi := s.Posi
	for _, v := range *es {
		targetPosi := v.Posi
		diffx := targetPosi["x"] - sPosi["x"] // 不可以写 .x .y
		diffy := targetPosi["y"] - sPosi["y"]
		currentDistance := diffx*diffx + diffy*diffy
		if currentDistance < minDistance {
			ret = v
		}

	}
	return ret
}
