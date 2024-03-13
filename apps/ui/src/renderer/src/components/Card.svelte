<div class="card">
  <slot />
</div>

<style lang="scss">
  @use "sass:color";
  @import "../assets/colors.scss";

  $border-radius: 2rem;
  $border: 0.0625rem solid color.change($text, $lightness: 18%);

  .card {
    width: 85%;
    height: 100%;
    max-width: 35rem;
    max-height: 20rem;
    padding: 1rem;
    margin: 1rem 0 0;
    gap: 0.5rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    border-top-right-radius: $border-radius;
    border-top-left-radius: $border-radius;
    border-top: $border;
    border-left: $border;
    border-right: $border;

    background-color: $background;
  }
</style>
