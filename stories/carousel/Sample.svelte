<script>
  import { Carousel, CarouselItem } from "sveltestrap";

  let items = [
      'https://i.ytimg.com/vi/FfsmLgD2ZFM/hqdefault.jpg',
      'https://i.ytimg.com/vi/rpufH_GchxI/hqdefault.jpg',
      'https://i.ytimg.com/vi/YxEzN8SLqkk/hqdefault.jpg',
  ];
  let activeIndex = 0;
</script>

<Carousel
  items="{items}"
  bind:activeIndex="{activeIndex}"
  pause="{ true }"
>  
  <div class="carousel-inner">
    {#each items as item, index}
    <CarouselItem bind:activeIndex="{activeIndex}" itemIndex="{index}">
        <img src="{item}" class="d-block w-100" alt="{`${item} ${index + 1}`}">
    </CarouselItem>
    {/each}
  </div>
</Carousel>