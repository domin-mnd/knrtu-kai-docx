<script lang="ts">
  import "@fontsource-variable/inter";
  import TitleBar from "./components/TitleBar.svelte";
  import Card from "./components/Card.svelte";
  import Title from "./components/Title.svelte";
  import Input from "./components/Input.svelte";
  import Submit from "./components/Submit.svelte";
  import Background from "./components/Background.svelte";
</script>

<main>
  <TitleBar />
  <Title />
  <Background />
  <Card>
    <Input />
    <Submit />
  </Card>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;

    width: 100vw;
    height: 100vh;
  }
</style>
