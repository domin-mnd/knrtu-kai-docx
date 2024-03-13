<script lang="ts">
  import { get } from "svelte/store";
  import { input } from "../store/input";

  function submit(event: MouseEvent) {
    event.preventDefault();
    window.electron.ipcRenderer.send("convert", get(input));
  }
</script>

<input type="submit" value="Конвертировать" on:click={submit} />

<style lang="scss">
  @use "sass:color";
  @import "../assets/colors.scss";

  $border-radius: 1rem;
  $border: 0.0625rem solid color.change($text, $lightness: 20%);
  $background-color: color.change($text, $lightness: 8%);

  input[type="submit"] {
    width: 100%;
    padding: 0.75rem 2rem;

    border-radius: $border-radius;
    background-color: $background-color;
    color: $text;
    border: $border;
    outline: none;
    font-size: 1rem;

    transition: background-color ease-in-out 0.2s;

    &:hover {
      transition: background-color ease-in-out 0.2s;
      cursor: pointer;
      background-color: color.change($background-color, $lightness: 10%);
    }
  }
</style>
