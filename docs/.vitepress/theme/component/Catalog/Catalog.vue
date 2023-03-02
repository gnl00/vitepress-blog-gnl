<script setup>
import { useData } from 'vitepress'

const { page }  = useData()

// 拿到 header，在右边渲染大纲
const headers = page.value.headers

const catalog = []

for(let header of headers) {
  if (header.level === 2) {
    // level 为 2 的结点直接 push
    catalog.push({
      ...header
    })
  } else {
    // 剩余的结点全部都是 level 为 3，找到对应的 parent
    const parent = catalog.slice(-1)[0]
    const child = {
      ...header
    }

    if (parent.children) {
      parent.children.push(child)
    } else {
      parent.children = [child]
    }
    // console.log(parent)
    catalog[catalog.length - 1] = parent
  }
}

const mouseEnter = evt => {
  // console.log('mouseEnter')
}

const mouseLeave = evt => {
  // console.log('mouseLeave')
}

</script>

<template>
  <div id="rightSidebar" class="right-sidebar">
    <ul v-for="item in catalog" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
      <li>
        <a :href="'#' + item.slug">{{item.title}}</a>
        <ul v-if="item.children" v-for="child in item.children">
          <li>
            <a :href="'#' + child.slug">{{child.title}}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.right-sidebar {
  width: auto;
  min-width: 10%;
  max-width: 10%;
  height: auto;
  max-height: 75%;
  background-color: whitesmoke;
  margin-right: 5px;
  padding-right: 15px;
  position: fixed;
  right: 0;
  top: 15%;
  z-index: 9;
  border-radius: 5px;
  list-style: none;
  overflow-y: scroll;
  /* overflow-scrolling: touch; */
}

/* 滚动条大小 */
.right-sidebar::-webkit-scrollbar {
  width: 5px;
  height: 1px;
}

/* 滚动条的内层滑轨背景颜色 */
.right-sidebar::-webkit-scrollbar-track-piece {
  background-color: #fff;
}
/* 滚动条的外层滑轨背景颜色 */
.right-sidebar::-webkit-scrollbar-track {
  background-color: #fff;
  border-radius: 10px;

}
/* 滚动条的内层滑块颜色 */
.right-sidebar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(237, 237, 237, 0.5);
  background-color: rgba(211, 215, 224, 0.70);
}
/* 滑轨两头的监听按钮颜色 */
.right-sidebar::-webkit-scrollbar-button {
  background-color: #fff;
  display: none;
  border-radius: 10px;
}

.right-sidebar ul {
  list-style: none;
}

#rightSidebar {
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  opacity: 0.5;
}

#rightSidebar:hover {
  opacity: 1;
  transform: scale(102%, 103%);
}
</style>