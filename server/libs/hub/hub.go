package fc_hub

import (
	player "flychicken/server/libs/ais/player"
	stupid "flychicken/server/libs/ais/stupid_man"
)

type Hub struct {
	Players map[string]player.Player
	ceid    int
	stupids map[int]stupid.Stupid
}

var H = Hub{
	Players: map[string]player.Player{},
	ceid:    0,
	stupids: map[int]stupid.Stupid{}}

func (h *Hub) AddAPlayer(id string) player.Player {
	p := player.Player{
		Id:        id,
		Birthposi: map[string]int{"x": 100, "y": 100},
		Metrics:   map[string]bool{"accX": false, "accY": false, "acc_X": false, "acc_Y": false},
		Target:    map[string]int{"x": 0, "y": 0},
		Posi:      map[string]int{"x": 0, "y": 0}}
	h.Players[id] = p
	return p
}

func (h *Hub) RemovePlayer(pid string) { // 方法外部调用也得大写，无一例外
	delete(h.Players, pid)
}

func (h *Hub) AddAStupid() stupid.Stupid {
	s := stupid.Stupid{
		Id:        H.ceid,
		Birthposi: map[string]int{"x": 0, "y": 0},
		Metrics:   map[string]bool{"accX": false, "accY": false, "acc_X": false, "acc_Y": false},
		Hp:        10,
		Target:    map[string]int{"x": 0, "y": 0}}
	h.stupids[H.ceid] = s
	h.ceid++
	return s
}

func (h *Hub) RemoveStupid(eid int) {
	delete(h.stupids, eid)
}
