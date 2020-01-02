<script>
  import { Carousel, CarouselControl, CarouselIndicators, CarouselItem, CarouselCaption } from "sveltestrap";

  let items = [
      {
          url: 'https://i.ytimg.com/vi/FfsmLgD2ZFM/hqdefault.jpg',
          title: 'goat 1',
          subTitle: 'good goat'
      },
      {
          url: 'https://i.ytimg.com/vi/rpufH_GchxI/hqdefault.jpg',
          title: 'goat 2',
          subTitle: 'better goat'
      },
      {
          url: 'https://i.ytimg.com/vi/YxEzN8SLqkk/hqdefault.jpg',
          title: 'goat 3',
          subTitle: 'best goat'
      },
  ];
  let activeIndex = 0;
</script>

<Carousel id="myCarousel" items="{items}" bind:activeIndex="{activeIndex}" ride="{ true }" interval="{ 2000 }" pause="{ true }">
  <CarouselIndicators bind:activeIndex="{activeIndex}" items="{items}" />
  
  <div class="carousel-inner">
    {#each items as item, index}
    <CarouselItem bind:activeIndex="{activeIndex}" itemIndex="{index}">
        <img src="{item.url}" class="d-block w-100" alt="{item.title}">
        <CarouselCaption captionHeader="{item.title}" captionText="{item.subTitle}" />
    </CarouselItem>
    {/each}
  </div>

  <CarouselControl direction="prev" bind:activeIndex="{activeIndex}" items="{items}" />
  <CarouselControl direction="next" bind:activeIndex="{activeIndex}" items="{items}" />
</Carousel>