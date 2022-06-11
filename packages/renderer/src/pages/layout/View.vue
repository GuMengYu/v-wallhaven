<template>
  <v-main :style="{paddingTop: 0}">
    <v-container class="pa-0" fluid>
      <router-view v-slot="{ Component }">
        <transition v-if="$route.meta['keepAlive']" name="route-animation" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
        <transition v-else name="route-animation" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-container>
  </v-main>
</template>
