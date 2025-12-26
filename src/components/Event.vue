<template>    
        <div>
            <div class="tw:p-3 tw:bg-[#ECEEF4] tw:rounded-xl">            
                <div class="tw:flex tw:justify-between tw:md:gap-5 tw:flex-wrap tw:items-center">
                    <div class="tw:flex tw:gap-[13px] tw:items-center">
                        <div class="tw:border tw:w-10 tw:h-10 tw:justify-center tw:flex tw:items-center tw:border-(--secondary-color) tw:rounded-full">
                            <p class="tw:leading-[1.1] tw:italic tw:text-center tw:tracking-[-8%] tw:text-[8px]">
                                THE<br>EVENTS<br>MAP
                            </p>
                        </div>
                        <h4 class="tw:text-[var(--primary-color)]-500 tw:leading-normal">{{ event.title }}</h4>
                    </div>

                    <button 
                        class="tw:py-1 tw:px-2 tw:gap-1 tw:text-[#EF4444] tw:leading-[1.4] tw:flex tw:items-center tw:border tw:border-[#EF4444] tw:rounded-md" 
                        v-if="event.live"
                    >
                        <img src="../assets/live-streaming.png" alt="Streaming Icon">
                        <span>{{ $t('eventCard.liveNow') }}</span>
                    </button>                    
                </div>

                <div class="tw:flex tw:md:justify-start tw:justify-between tw:md:gap-4 tw:mt-4">
                    <img 
                        :src="event.image" 
                        class="tw:rounded-lg tw:w-30 tw:object-cover" 
                    />

                    <div>
                        <div class="tw:flex tw:gap-3 tw:md:gap-6 tw:text-center">
                            <div v-for="(v, k) in countdown" :key="k">
                                <p class="tw:text-sm tw:leading-[1.2] tw:text-(--teritiary-color)">{{ String(v).padStart(2, '0') }}</p>
                                <p class="tw:text-[10px] tw:capitalize">{{ k }}</p>
                            </div>
                        </div>

                        <div class="tw:space-y-3 tw:mt-3">
                            <DetailRow icon="date-time" :text="event.date" />
                            <DetailRow icon="location-02" :text="event.location" />
                            <DetailRow icon="music-note" :text="event.category?.name == null ? 'N/A' : event.category['name']" />
                            <DetailRow icon="bitcoin-bag" :text="event.price" />
                            <DetailRow icon="baby-boy-dress" :text="event.dresscode" />
                            <DetailRow icon="user-group" :text="event.age" />
                        </div>                                
                    </div>                    
                </div>    

                <div class="tw:flex tw:justify-between tw:items-center tw:mt-4">
                    <div class="tw:flex tw:gap-1 tw:items-center">
                        <img src="../assets/favourite.png" alt="Favourite Icon">
                        <a href="#" class="tw:leading-[1.2]">{{ $t('eventCard.link') }}</a>
                    </div>

                    <div class="tw:flex tw:gap-3">
                        <button class="tw:bg-white tw:gap-1 tw:px-3 tw:py-2 tw:flex tw:items-center tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">
                            <img src="../assets/location-03.png" alt="Location Icon">
                            <span>{{ $t('eventCard.route') }}</span>
                        </button>

                        <button class="tw:bg-white tw:px-3 tw:py-2 tw:flex tw:items-center tw:gap-1 tw:text-sm tw:leading-[1.2] tw:rounded-md tw:border tw:border-(--secondary-color)">
                            <span>{{ $t('eventCard.viewEvent') }}</span>
                            <img src="../assets/arrow-right.png" alt="Arrow Icon">
                        </button>
                    </div>
                </div>                            
            </div>  
        </div>
            
</template>



<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import DetailRow from './DetailedRow.vue'

const { t } = useI18n()

const props = defineProps({ event: Object })

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let interval

const updateCountdown = () => {
  // Use start_datetime for accurate countdown
    const target = new Date(props.event.start_datetime).getTime()
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