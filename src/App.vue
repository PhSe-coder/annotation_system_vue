<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
/* 设置滚动条的样式 */
body::-webkit-scrollbar {
  width:12px;

}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow:rgba(0,0,0,0.3);
  border-radius:10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius:10px;
  background:rgba(0,0,0,0.1);
  -webkit-box-shadow:rgba(0,0,0,0.5);

}
::-webkit-scrollbar-thumb:hover {
  background:rgba(0,0,0,0.2);
}
</style>
