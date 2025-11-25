<template>
    <div class="relative">
        <div class="bg-white rounded-2xl p-4">  
            <div class="p-3 bg-[#ECEEF4] rounded-xl">            
                <div class="flex justify-between md:gap-5 flex-wrap items-center">
                    <div class="flex gap-[13px] items-center">
                        <div class="border w-[40px] h-[40px] justify-center flex items-center border-[var(--secondary-color)] rounded-full">
                            <p class="leading-[1.1] italic text-center tracking-[-8%] text-[8px]">THE<br>EVENTS<br>MAP</p>
                        </div>
                        <!-- <img :src="event.image" class="w-10 h-10 rounded-full object-cover" /> -->
                        <h4 class="text-[var(--primary-color)]-500 leading-[1.5]">{{ event.title }}</h4>
                    </div>
                    <button class="py-1 px-2 gap-1 text-[#EF4444] leading-[1.4] flex items-center border border-[#EF4444] rounded-md" v-if="event.live"><img src="../assets/live-streaming.png" alt="Streaming Icon"><span>Live Now</span></button>                    
                </div>
                <div class="flex md:gap-4 mt-4">
                    <img src="../assets/dummy-event.png" class="rounded-lg w-30 object-cover hidden md:block" />
                    <div >
                        <div class="flex gap-6 text-center">
                            <div v-for="(v, k) in countdown" :key="k">
                                <!-- <p class="text-lg font-bold">{{ v }}</p> -->
                                <p class="text-sm leading-[1.2] text-[var(--teritiary-color)]">00</p>
                                <!-- <p class="text-[10px] text-gray-500 capitalize">{{ k }}</p> -->
                                <p class="text-[10px] capitalize">{{k }}</p>
                            </div>
                        </div>

                        <div class="space-y-3 mt-3">
                            <DetailRow icon="date-time" :text="event.date" />
                            <DetailRow icon="location-02" :text="event.location" />
                            <DetailRow icon="music-note" :text="event.category" />
                            <DetailRow icon="bitcoin-bag" :text="event.price" />
                            <DetailRow icon="baby-boy-dress" :text="event.dresscode" />
                            <DetailRow icon="user-group" :text="event.age" />
                        </div>                                
                    </div>                    
                </div>    
                <div class="flex justify-between items-center mt-4">
                    <div class="flex gap-1 items-center">
                        <img src="../assets/favourite.png" alt="Favourite Icon">
                        <a href="#" class="leading-[1.2]">Link</a>
                    </div>
                    <div class="flex gap-3">
                        <button class="bg-white gap-1 px-3 py-2 flex items-center text-sm leading-[1.2] rounded-[6px] border border-[var(--secondary-color)]"><img src="../assets/location-03.png" alt="Location Icon"><span>Route</span></button>
                        <button class="bg-white px-3 py-2 flex items-center gap-1 text-sm leading-[1.2] rounded-[6px] border border-[var(--secondary-color)]"><span>View event</span><img src="../assets/arrow-right.png" alt="Location Icon"></button>
                    </div>
                </div>                            
            </div>  
        </div>
       <div class="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[10px]  border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white shadow-md">
        </div> 
    </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DetailRow from './DetailedRow.vue'

const props = defineProps({ event: Object })

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let interval

const updateCountdown = () => {
  const target = new Date(props.event.date).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  countdown.value = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => clearInterval(interval))
</script>