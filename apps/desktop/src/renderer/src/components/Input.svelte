<script lang="ts">
  import { get } from "svelte/store";
  import { input } from "../store/input";

  let inputValue = get(input);

  function change(value: string) {
    input.set(value);
    inputValue = value;
  }

  function onFileChange(event: Event) {
    const element = event.target as HTMLInputElement;
    change(element.files[0].path);
  }

  function onUrlChange(event: Event) {
    const element = event.target as HTMLInputElement;
    change(element.value);
  }
</script>

<div class="input-file">
  <input type="url" value={inputValue} placeholder="Путь к md файлу..." on:change={onUrlChange} />
  <label>
    <input type="file" accept=".md" on:change={onFileChange} />
    ...
  </label>
</div>

<style lang="scss">
  @use "sass:color";
  @import "../assets/colors.scss";

  $border: 0.0625rem solid color.change($text, $lightness: 18%);
  $wrapper-background-color: color.change($text, $lightness: 10%);
  $button-background-color: color.change($wrapper-background-color, $lightness: 10%);

  .input-file {
    width: 100%;
    min-height: 3rem;
    padding: 0.5rem;

    border-radius: 1rem;
    border: $border;
    background-color: $wrapper-background-color;

    display: flex;
    justify-content: space-between;
    align-items: center;

    input[type="file"] {
      display: none;
    }

    input[type="url"] {
      flex-grow: 1;
      min-width: 0;
      height: 2.1875rem;
      padding: 0 1rem;

      background-color: transparent;
      border: none;
      outline: none;
      color: $text;
    }

    label {
      border-radius: 0.5rem;
      padding: 0.25rem 1rem;
      max-height: 2.1875rem;

      background-color: $button-background-color;
      border: $border;

      transition: background-color ease-in-out 0.2s;

      &:hover {
        transition: background-color ease-in-out 0.2s;
        background-color: color.change($button-background-color, $lightness: 12%);
      }

      cursor: pointer;
    }
  }
</style>
