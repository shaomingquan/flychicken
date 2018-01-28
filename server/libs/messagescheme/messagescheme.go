package mscheme

import (
	"encoding/json"
)

type Message struct {
	Category string `json:"type"` // 属性想抛出也必须大写
	Action   string `json:"action"`
	Data     []int  `json:"data"`
}

type Messages struct {
	batch []Message `json:"batch"`
}

func Jsonparse(Message string) (m Message) {
	json.Unmarshal([]byte(Message), &m)
	return
}

func Jsonstringify(m *Message) (binary []byte) {
	binary, _ = json.Marshal(&m)
	return
}

func JsonparseMultiple(batch string) (b Messages) {
	json.Unmarshal([]byte(batch), &b)
	return
}

func JsonstringifyMultiple(b *Messages) (binary []byte) {
	binary, _ = json.Marshal(&b)
	return
}
